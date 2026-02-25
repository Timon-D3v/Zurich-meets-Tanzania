import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, EditUserCommand, GetAllUsersApiEndpointResponse, GetVisitorCountsApiEndpointResponse, PrivateUser, UpdateUserProfilePictureWithIdApiEndpointResponse, UpdateUserWithIdApiEndpointResponse } from "..";
import { getLastXDaysVisitorCounts } from "../shared/analytics";
import { deleteUserWithId, getAllUsers, getUserWithId, setNewAddressWithId, setNewFirstNameWithId, setNewLastNameWithId, setNewPassword, setNewPhoneNumberWithId, setNewProfilePictureWithId, setUserTypeWithId } from "../shared/user.database";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";
import { CONFIG } from "../config";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sendNewPassword } from "../shared/auth.email";

// Router Serves under /api/secured/admin/analytics
const router = Router();

router.post("/getVisitorCount", async (req: Request, res: Response): Promise<void> => {
    try {
        const { days } = req.body;

        if (typeof days !== "number" || isNaN(days) || days <= 0) {
            throw new Error("Bitte gib eine gültige Anzahl an Tagen ein.");
        }

        const visitorCounts = await getLastXDaysVisitorCounts(days);

        res.json({
            error: false,
            message: `Success`,
            data: visitorCounts,
        } as GetVisitorCountsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetVisitorCountsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetVisitorCountsApiEndpointResponse);
    }
});

router.get("/getAllUsers", async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsers();

        if (users.error !== null) {
            throw new Error(users.error);
        }

        res.json({
            error: false,
            message: `Success`,
            data: users.data,
        } as GetAllUsersApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetAllUsersApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetAllUsersApiEndpointResponse);
    }
});

router.post("/updateUserWithId", async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, data } = req.body;

        if (typeof userId !== "number" || isNaN(userId) || userId <= 0) {
            throw new Error("Bitte gib eine gültige User Id ein.");
        }

        if (!Array.isArray(data)) {
            throw new Error("Es wurden keine Änderungen übermittelt.");
        }

        if (data.length === 0) {
            res.json({
                error: false,
                message: "NO_CHANGE",
                data: null,
            } as UpdateUserWithIdApiEndpointResponse);

            return;
        }

        for (const command of data) {
            if (command?.executionType !== "edit" && command?.executionType !== "reset") {
                throw new Error("Bitte gib einen gültigen Ausführungstyp ein.");
            }

            if (command?.userId !== userId) {
                throw new Error("Die Benutzer Id in den Änderungen stimmt nicht mit der übermittelten Benutzer Id überein.");
            }

            if (!["firstName", "lastName", "phone", "address", "type", "picture"].includes(command?.fieldType)) {
                throw new Error("Bitte gib einen gültigen Feldtyp ein.");
            }

            if (command.executionType === "edit" && command.fieldType !== "picture" && (typeof command?.previousValue !== "string" || typeof command?.newValue !== "string")) {
                throw new Error("Bitte gib gültige Werte für das alte und neue Feld ein.");
            } else if (command.executionType === "edit" && command.fieldType === "picture" && (typeof command?.previousUrl !== "string" || typeof command?.newUrl !== "string")) {
                throw new Error("Bitte gib gültige URLs für das alte und neue Bild ein.");
            }
        }

        // Validation recap
        // - userId must be a positive number
        // - data must be a non-empty array
        // - each entry in data must have a valid executionType and fieldType
        // - if executionType is "edit" and fieldType is not "picture", previousValue and newValue must be strings
        // - if executionType is "edit" and fieldType is "picture", previousUrl and newUrl must be strings

        // If the validation is passed, we can proceed with the update logic

        const userData = await getUserWithId(userId);

        if (userData.error !== null) {
            throw new Error(userData.error);
        }

        if (userData.data.length === 0) {
            throw new Error("Es wurde kein Nutzer mit der Id '" + userId + "' gefunden.");
        }

        const user = userData.data[0] as PrivateUser;

        const commands = data as EditUserCommand[];

        const resetOptions = {
            phone: async (userId: number) => {
                return await setNewPhoneNumberWithId(userId, "Keine Nummer");
            },
            type: async (userId: number) => {
                return await setUserTypeWithId(userId, "user");
            },
            picture: async (userId: number) => {
                return await setNewProfilePictureWithId(userId, "/svg/personal.svg");
            }
        }

        const editOptions = {
            firstName: async (userId: number, newValue: string) => {
                return await setNewFirstNameWithId(userId, newValue);
            },
            lastName: async (userId: number, newValue: string) => {
                return await setNewLastNameWithId(userId, newValue);
            },
            phone: async (userId: number, newValue: string) => {
                return await setNewPhoneNumberWithId(userId, newValue);
            },
            address: async (userId: number, newValue: string) => {
                return await setNewAddressWithId(userId, newValue);
            },
            type: async (userId: number, newValue: "user" | "member" | "admin") => {
                return await setUserTypeWithId(userId, newValue);
            },
            picture: async (userId: number, newValue: string) => {
                return await setNewProfilePictureWithId(userId, newValue);
            }
        }

        for (const command of commands) {
            if (command.executionType === "reset") {
                const result = await resetOptions[command.fieldType](user.id);

                if (result.error !== null) {
                    throw new Error(result.error);
                }
            } else if (command.executionType === "edit" && command.fieldType === "picture") {
                if (command.newUrl === user.picture) {
                    console.info("Skipping profile picture update for user with id " + user.id + " since the new URL is the same as the current one.");
                    continue;
                }

                const result = await editOptions[command.fieldType](user.id, command.newUrl);

                if (result.error !== null) {
                    throw new Error(result.error);
                }
            } else if (command.executionType === "edit" && command.fieldType === "type") {
                if (command.newValue === user.type) {
                    console.info("Skipping user type update for user with id " + user.id + " since the new type is the same as the current one.");
                    continue;
                }

                if (!["user", "member", "admin"].includes(command.newValue)) {
                    throw new Error("Invalid user type: " + command.newValue);
                }

                const result = await editOptions[command.fieldType](user.id, command.newValue as "user" | "member" | "admin");

                if (result.error !== null) {
                    throw new Error(result.error);
                }
            } else if (command.executionType === "edit" && command.fieldType !== "type") {
                if (command.newValue === user[command.fieldType]) {
                    console.info("Skipping update for field '" + command.fieldType + "' for user with id " + user.id + " since the new value is the same as the current one.");
                    continue;
                }

                const result = await editOptions[command.fieldType](user.id, command.newValue);

                if (result.error !== null) {
                    throw new Error(result.error);
                }
            }
        }

        const updatedUserData = await getUserWithId(user.id);

        if (updatedUserData.error !== null) {
            throw new Error("Der Benutzer konnte zwar erfolgreich aktualisiert werden, aber die aktualisierten Daten konnten nicht abgerufen werden: " + updatedUserData.error);
        }

        res.json({
            error: false,
            message: `Success`,
            data: updatedUserData.data[0],
        } as UpdateUserWithIdApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null
            } as UpdateUserWithIdApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null
        } as UpdateUserWithIdApiEndpointResponse);
    }
});

router.post("/uploadProfilePictureForUserWithId", multerInstance.single("picture"), async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        const picture = req.file;


        if (typeof userId !== "string" || typeof Number(userId) !== "number" || isNaN(Number(userId)) || Number(userId) <= 0) {
            throw new Error("Invalid parameter userId.");
        }

        if (!picture) {
            throw new Error("No picture file uploaded.");
        }

        const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, picture.buffer, picture.originalname);
        
        if (response.error) {
            throw new Error(response.message);
        }

        const result = await setNewProfilePictureWithId(Number(userId), response.url);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: `Success`,
            data: { pictureUrl: response.url },
        } as UpdateUserProfilePictureWithIdApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null
            } as UpdateUserProfilePictureWithIdApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null
        } as UpdateUserProfilePictureWithIdApiEndpointResponse);
    }
});

router.post("/deleteUserWithId", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;

        if (typeof userId !== "number" || isNaN(userId) || userId <= 0) {
            throw new Error("Bitte gib eine gültige User Id ein.");
        }

        const deletionResult = await deleteUserWithId(userId);

        if (deletionResult.error !== null) {
            throw new Error(deletionResult.error);
        }

        res.json({
            error: false,
            message: `Success`,
        } as ApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            } as ApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponse);
    }
});

router.post("/resetUserPasswordWithId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (typeof userId !== "number" || isNaN(userId) || userId <= 0) {
            throw new Error("Invalid parameter 'userId'.");
        }

        const user = await getUserWithId(userId);

        if (user.data === null) {
            console.error("DEBUG:\n", user.error);
            throw new Error(PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE);
        }

        if (user.data.length === 0) {
            throw new Error("Es wurde kein Benutzer mit der Id '" + userId + "' gefunden.");
        }

        const userData = user.data[0] as PrivateUser;

        // Generate a new password and send it to the user's email address
        const newPassword = randomBytes(16).toString("hex");

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        const result = await setNewPassword(userData.email, newPasswordHash);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        const sentSuccessfully = await sendNewPassword(newPassword, userData.email, userData.firstName, userData.lastName);

        if (!sentSuccessfully) {
            throw new Error("Das Senden der E-Mail mit dem neuen Passwort ist fehlgeschlagen.");
        }

        res.json({
            error: false,
            message: "Success",
        } as ApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            } as ApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponse);
    }
});

export default router;
