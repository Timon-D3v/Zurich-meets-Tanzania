import { Request, Response, Router } from "express";
import { multerInstance } from "../shared/instance.multer";
import { delivApiUpload, delivApiUpdateFile } from "delivapi-client";
import { UpdateUserInformationApiEndpointResponse, UpdateUserProfilePictureWithIdApiEndpointResponse, ApiEndpointResponse } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";
import { setNewEmailWithId, setNewFirstNameWithId, setNewLastNameWithId, setNewAddressWithId, setNewPasswordWithId, setNewProfilePictureWithId, setNewPhoneNumberWithId } from "../shared/user.database";
import { CONFIG } from "../config";
import bcrypt from "bcryptjs";
import { sendPasswordChangeConfirmation } from "../shared/auth.email";
import { getAllNewsletterEmails, updateNewsletterList, addToNewsletterList, removeFromNewsletterList } from "../shared/newsletter.database";

// Router Serves under /api/secured/account
const router = Router();

router.post("/updateUserInformation", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, address, phone } = req.body;

        const alreadyDoneUpdates: Array<"email" | "password" | "firstName" | "lastName" | "address" | "phone"> = [];

        if (req.session.user === undefined || req.session.user === null) {
            throw new Error("Ungültige Benutzersitzung. Bitte logge dich erneut ein.");
        }

        const userId = req.session.user.id;

        if (email === null) {
            // Skip the email
            console.info("Email will not be updated.");
        } else {
            if (typeof email === "string" && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
                // Email is valid: Save it to the database
                const result = await setNewEmailWithId(userId, email);

                if (result.error) {
                    res.json({
                        error: true,
                        message: "Die eingegebene E-Mail-Adresse konnte nicht gespeichert werden. Möglicherweise ist sie bereits mit einem anderen Konto verknüpft. Bitte überprüfe deine Eingabe.",
                        data: {
                            newUser: req.session.user,
                            partialUpdate: alreadyDoneUpdates.length > 0,
                            alreadyDoneUpdates: alreadyDoneUpdates,
                        },
                    } as UpdateUserInformationApiEndpointResponse);

                    return;
                }

                alreadyDoneUpdates.push("email");
                req.session.user.email = email;
            } else {
                throw new Error("Die eingegebene E-Mail-Adresse ist ungültig. Bitte überprüfe deine Eingabe.");
            }
        }

        if (password === null) {
            // Skip the password
            console.info("Password will not be updated.");
        } else {
            if (typeof password === "string") {
                // Password is valid: Save it to the database
                const passwordHash = await bcrypt.hash(password, 10);

                const result = await setNewPasswordWithId(userId, passwordHash);

                if (result.error) {
                    res.json({
                        error: true,
                        message: "Beim Speichern des Passworts ist ein Fehler aufgetreten: " + PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
                        data: {
                            newUser: req.session.user,
                            partialUpdate: alreadyDoneUpdates.length > 0,
                            alreadyDoneUpdates: alreadyDoneUpdates,
                        },
                    } as UpdateUserInformationApiEndpointResponse);

                    return;
                }

                alreadyDoneUpdates.push("password");
                req.session.user.password = passwordHash;

                // Send a security email to the user about the password change
                await sendPasswordChangeConfirmation(password, req.session.user.email, req.session.user.firstName, req.session.user.lastName);
            } else {
                throw new Error("Das eingegebene Passwort ist ungültig. Bitte überprüfe deine Eingabe.");
            }
        }

        if (firstName === null) {
            // Skip the first name
            console.info("First name will not be updated.");
        } else {
            if (typeof firstName === "string") {
                // First name is valid: Save it to the database
                const result = await setNewFirstNameWithId(userId, firstName);

                if (result.error) {
                    res.json({
                        error: true,
                        message: "Beim Speichern des Vornamens ist ein Fehler aufgetreten: " + PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
                        data: {
                            newUser: req.session.user,
                            partialUpdate: alreadyDoneUpdates.length > 0,
                            alreadyDoneUpdates: alreadyDoneUpdates,
                        },
                    } as UpdateUserInformationApiEndpointResponse);

                    return;
                }

                alreadyDoneUpdates.push("firstName");
                req.session.user.firstName = firstName;
            } else {
                throw new Error("Der eingegebene Vorname ist ungültig. Bitte überprüfe deine Eingabe.");
            }
        }

        if (lastName === null) {
            // Skip the last name
            console.info("Last name will not be updated.");
        } else {
            if (typeof lastName === "string") {
                // Last name is valid: Save it to the database
                const result = await setNewLastNameWithId(userId, lastName);

                if (result.error) {
                    res.json({
                        error: true,
                        message: "Beim Speichern des Nachnamens ist ein Fehler aufgetreten: " + PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
                        data: {
                            newUser: req.session.user,
                            partialUpdate: alreadyDoneUpdates.length > 0,
                            alreadyDoneUpdates: alreadyDoneUpdates,
                        },
                    } as UpdateUserInformationApiEndpointResponse);

                    return;
                }

                alreadyDoneUpdates.push("lastName");
                req.session.user.lastName = lastName;
            } else {
                throw new Error("Der eingegebene Nachname ist ungültig. Bitte überprüfe deine Eingabe.");
            }
        }

        if (address === null) {
            // Skip the address
            console.info("Address will not be updated.");
        } else {
            if (typeof address === "string" && address.includes(", ") && address.includes(" ")) {
                const streetName = address.split(",")[0];
                const postalCode = address.split(", ")[1].split(" ")[0];
                const city = address.split(", ")[1].split(" ")?.slice(1)?.join(" ");

                if (!streetName || !postalCode || !city) {
                    throw new Error("Die eingegebene Adresse ist ungültig. Bitte überprüfe deine Eingabe.");
                }

                // Address is valid: Save it to the database
                const result = await setNewAddressWithId(userId, address);

                if (result.error) {
                    res.json({
                        error: true,
                        message: "Beim Speichern der Adresse ist ein Fehler aufgetreten: " + PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
                        data: {
                            newUser: req.session.user,
                            partialUpdate: alreadyDoneUpdates.length > 0,
                            alreadyDoneUpdates: alreadyDoneUpdates,
                        },
                    } as UpdateUserInformationApiEndpointResponse);

                    return;
                }

                alreadyDoneUpdates.push("address");
                req.session.user.address = address;
            } else {
                throw new Error("Die eingegebene Adresse ist ungültig. Bitte überprüfe deine Eingabe.");
            }
        }

        if (phone === null) {
            // Skip the phone number
            console.info("Phone number will not be updated.");
        } else {
            if (typeof phone === "string" && (/^\+?[0-9\s\-()]{6,20}$/.test(phone) || phone === "" || phone === "Keine Nummer")) {
                // Phone number is valid: Save it to the database
                const result = await setNewPhoneNumberWithId(userId, phone === "" ? "Keine Nummer" : phone);

                if (result.error) {
                    res.json({
                        error: true,
                        message: "Beim Speichern der Telefonnummer ist ein Fehler aufgetreten: " + PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
                        data: {
                            newUser: req.session.user,
                            partialUpdate: alreadyDoneUpdates.length > 0,
                            alreadyDoneUpdates: alreadyDoneUpdates,
                        },
                    } as UpdateUserInformationApiEndpointResponse);

                    return;
                }

                alreadyDoneUpdates.push("phone");
                req.session.user.phone = phone;
            } else {
                throw new Error("Die eingegebene Telefonnummer ist ungültig. Bitte überprüfe deine Eingabe.");
            }
        }

        res.json({
            error: false,
            message: "Deine Angaben wurden erfolgreich aktualisiert.",
            data: {
                newUser: req.session.user,
                partialUpdate: false,
                alreadyDoneUpdates: alreadyDoneUpdates,
            },
        } as UpdateUserInformationApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: {
                    newUser: null,
                    partialUpdate: false,
                    alreadyDoneUpdates: [],
                },
            } as UpdateUserInformationApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: {
                newUser: null,
                partialUpdate: false,
                alreadyDoneUpdates: [],
            },
        } as UpdateUserInformationApiEndpointResponse);
    }
});

router.post("/updateUserProfilePicture", multerInstance.single("image"), async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;
        const user = req.session.user!;

        if (!file) {
            throw new Error("No file uploaded.");
        }

        const allowedMimeTypes = ["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico"];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            console.error("Invalid file mime type for file:", file.originalname, "with mime type:", file.mimetype);
            throw new Error(`Die Datei '${file.originalname}' ist keine gültige Bilddatei. Bitte lade nur Bilddateien hoch.`);
        }

        const response = user.picture === "/svg/personal.svg" ? await delivApiUpload(file.buffer) : await delivApiUpdateFile(user.picture.replace(`${CONFIG.DELIVAPI_URL}/cdn/${CONFIG.DELIVAPI_USER}/`, ""), file.buffer);

        if (response.error) {
            throw new Error("Bild konnte nicht hochgeladen werden: " + response.message);
        }

        const result = await setNewProfilePictureWithId(user.id, response.url);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Dein Profilbild wurde erfolgreich aktualisiert.",
            data: {
                pictureUrl: response.url,
            },
        } as UpdateUserProfilePictureWithIdApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as UpdateUserProfilePictureWithIdApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as UpdateUserProfilePictureWithIdApiEndpointResponse);
    }
});

router.post("/newsletterSignUp", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.session.user!;
        const gender = req.body?.gender;

        if (!gender || typeof gender !== "string" || !["Herr", "Frau", "Divers"].includes(gender)) {
            throw new Error("Invalid gender provided.");
        }

        const newsletterUsers = await getAllNewsletterEmails();

        if (newsletterUsers.error !== null) {
            throw new Error(newsletterUsers.error);
        }

        const isAlreadySignedUp = newsletterUsers.data!.some((entry: { email: string }) => entry.email === user.email);

        const result = isAlreadySignedUp
            ? await updateNewsletterList(user.email, user.firstName, user.lastName, gender as "Herr" | "Frau" | "Divers")
            : await addToNewsletterList(user.email, user.firstName, user.lastName, gender as "Herr" | "Frau" | "Divers");

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: isAlreadySignedUp ? "Du bist bereits in der Newsletterliste. Deine Daten wurden aktualisiert." : "Du hast dich erfolgreich für den Newsletter angemeldet.",
        } as ApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as ApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as ApiEndpointResponse);
    }
});

router.post("/newsletterSignOut", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.session.user!;

        const result = await removeFromNewsletterList(user.email);

        if (result.error !== null) {
            throw new Error(result.error);
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
                data: null,
            } as ApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as ApiEndpointResponse);
    }
});

export default router;
