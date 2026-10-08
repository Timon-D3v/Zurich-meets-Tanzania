import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, EditStrictTeamMemberCommand, GetAllMembersOfAllTeamsApiEndpointResponse, PrivateUser, Team, TeamMemberUser, UpdateTeamMemberWithIdApiEndpointResponse } from "..";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";
import {
    createTeam,
    updateTeam,
    getCurrentTeam,
    updateMembers,
    getTeamMemberEntry,
    createTeamMemberEntry,
    getAllMembersOfAllTeams,
    updateTeamMemberSecondaryPicture,
    getTeamMemberWithUserData,
    updateTeamMemberProfession,
    updateTeamMemberMotive,
    updateTeamMemberRole,
} from "../shared/team.database";
import { getUserWithEmail } from "../shared/user.database";

// Router Serves under /api/secured/admin/team
const router = Router();

router.post("/createTeam", multerInstance.single("image"), async (req: Request, res: Response): Promise<void> => {
    try {
        const { motto, description } = req.body;
        const file = req.file;

        if (typeof motto !== "string" || motto.trim() === "") {
            throw new Error("Bitte gib ein gültiges Motto ein.");
        }

        if (typeof description !== "string") {
            throw new Error("Bitte gib eine gültige Beschreibung ein.");
        }

        if (!file) {
            throw new Error("Es wurde kein Bild hochgeladen.");
        }

        const response = await delivApiUpload(file.buffer);

        if (response.error) {
            throw new Error("Das Bild konnte nicht hochgeladen werden. Bitte versuche es später erneut. Weitere Informationen: " + response.message);
        }

        const result = await createTeam(motto, description, response.url);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: `Das Team mit dem Motto "${motto}" wurde erfolgreich erstellt.`,
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

router.post("/updateTeam", multerInstance.single("image"), async (req: Request, res: Response): Promise<void> => {
    try {
        const { motto, description } = req.body;
        const file = req.file;
        let fileUploaded = false;
        let newFileUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;

        if (typeof motto !== "string" || motto.trim() === "") {
            throw new Error("Bitte gib ein gültiges Motto ein.");
        }

        if (typeof description !== "string") {
            throw new Error("Bitte gib eine gültige Beschreibung ein.");
        }

        if (file) {
            fileUploaded = true;

            const response = await delivApiUpload(file.buffer);

            if (response.error) {
                throw new Error("Das Bild konnte nicht hochgeladen werden. Bitte versuche es später erneut. Weitere Informationen: " + response.message);
            }

            newFileUrl = response.url;
        }

        const currentTeam = await getCurrentTeam();

        if (currentTeam.error !== null) {
            throw new Error(currentTeam.error);
        }

        if (currentTeam.data.length === 0) {
            throw new Error("Es existiert kein Team, das aktualisiert werden kann.");
        }

        const team = currentTeam.data[0] as Team;

        const result = await updateTeam(team.id, motto, description, fileUploaded ? newFileUrl : team.picture);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: `Das aktuelle Team wurde erfolgreich aktualisiert.`,
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

router.post("/addMember", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email)) {
            throw new Error("Bitte gib eine gültige E-Mail-Adresse ein.");
        }

        const currentTeam = await getCurrentTeam();

        if (currentTeam.error !== null) {
            throw new Error(currentTeam.error);
        }

        const team = currentTeam.data[0] as Team;

        const userData = await getUserWithEmail(email);

        if (userData.error !== null) {
            throw new Error(userData.error);
        }

        if (userData.data.length === 0) {
            throw new Error("Es existiert kein Benutzer mit dieser E-Mail-Adresse.");
        }

        const user = userData.data[0] as PrivateUser;

        const indexOfMember = team.members.findIndex((userIdOfMember: number): boolean => userIdOfMember === user.id);

        if (indexOfMember !== -1) {
            throw new Error("Das angegebene Teammitglied ist schon im Team.");
        }

        // Create an entry in the teamMember table (if it doesn't exist yet) and add the user to the team
        const teamMemberData = await getTeamMemberEntry(user.id);

        if (teamMemberData.error !== null) {
            throw new Error(teamMemberData.error);
        }

        if (teamMemberData.data.length === 0) {
            const createTeamMemberResult = await createTeamMemberEntry(user.id);

            if (createTeamMemberResult.error !== null) {
                throw new Error(createTeamMemberResult.error);
            }
        }

        team.members.push(user.id);

        const result = await updateMembers(team.id, team.members);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: `Das Teammitglied mit der E-Mail "${email}" wurde erfolgreich hinzugefügt.`,
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

router.post("/removeMember", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email)) {
            throw new Error("Bitte gib eine gültige E-Mail-Adresse ein.");
        }

        const currentTeam = await getCurrentTeam();

        if (currentTeam.error !== null) {
            throw new Error(currentTeam.error);
        }

        const team = currentTeam.data[0] as Team;

        const userData = await getUserWithEmail(email);

        if (userData.error !== null) {
            throw new Error(userData.error);
        }

        if (userData.data.length === 0) {
            throw new Error("Es existiert kein Benutzer mit dieser E-Mail-Adresse.");
        }

        const user = userData.data[0] as PrivateUser;

        const indexOfMember = team.members.findIndex((userIdOfMember: number): boolean => userIdOfMember === user.id);

        if (indexOfMember === -1) {
            throw new Error("Das angegebene Teammitglied ist nicht im Team vorhanden.");
        }

        team.members.splice(indexOfMember, 1);

        const result = await updateMembers(team.id, team.members);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: `Das Teammitglied mit der E-Mail "${email}" wurde erfolgreich entfernt.`,
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

router.get("/getAllMembersOfAllTeams", async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getAllMembersOfAllTeams();

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Die Mitglieder aller Teams wurden erfolgreich abgerufen.",
            data: result.data as TeamMemberUser[],
        } as GetAllMembersOfAllTeamsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetAllMembersOfAllTeamsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetAllMembersOfAllTeamsApiEndpointResponse);
    }
});

router.post("/uploadSecondaryPictureForUserWithId", multerInstance.single("picture"), async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const picture = req.file;

        if (typeof userId !== "string" || typeof Number(userId) !== "number" || isNaN(Number(userId)) || Number(userId) <= 0) {
            throw new Error("Invalid parameter userId.");
        }

        if (!picture) {
            throw new Error("No picture file uploaded.");
        }

        const response = await delivApiUpload(picture.buffer);

        if (response.error) {
            throw new Error(response.message);
        }

        const result = await updateTeamMemberSecondaryPicture(Number(userId), response.url);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: response.url,
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

router.post("/updateMemberWithId", async (req: Request, res: Response): Promise<void> => {
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
            } as UpdateTeamMemberWithIdApiEndpointResponse);

            return;
        }

        for (const command of data) {
            if (command?.executionType !== "edit" && command?.executionType !== "reset") {
                throw new Error("Bitte gib einen gültigen Ausführungstyp ein.");
            }

            if (command?.userId !== userId) {
                throw new Error("Die Benutzer Id in den Änderungen stimmt nicht mit der übermittelten Benutzer Id überein.");
            }

            if (!["profession", "role", "motive", "secondaryPicture"].includes(command?.fieldType)) {
                throw new Error("Bitte gib einen gültigen Feldtyp ein.");
            }

            if (command.executionType === "edit" && command.fieldType !== "secondaryPicture" && (typeof command?.previousValue !== "string" || typeof command?.newValue !== "string")) {
                throw new Error("Bitte gib gültige Werte für das alte und neue Feld ein.");
            } else if (command.executionType === "edit" && command.fieldType === "secondaryPicture" && (typeof command?.previousUrl !== "string" || typeof command?.newUrl !== "string")) {
                throw new Error("Bitte gib gültige URLs für das alte und neue Bild ein.");
            }
        }

        // Validation recap
        // - userId must be a positive number
        // - data must be a non-empty array
        // - each entry in data must have a valid executionType and fieldType
        // - if executionType is "edit" and fieldType is not "secondaryPicture", previousValue and newValue must be strings
        // - if executionType is "edit" and fieldType is "secondaryPicture", previousUrl and newUrl must be strings

        // If the validation is passed, we can proceed with the update logic

        const userData = await getTeamMemberWithUserData(userId);

        if (userData.error !== null) {
            throw new Error(userData.error);
        }

        if (userData.data.length === 0) {
            throw new Error("Es wurde kein Benutzer mit der Id '" + userId + "' gefunden.");
        }

        const user = userData.data[0] as TeamMemberUser;

        const commands = data as EditStrictTeamMemberCommand[];

        const resetOptions = {
            profession: async (userId: number) => {
                return await updateTeamMemberProfession(userId, "Noch kein Beruf angegeben");
            },
            motive: async (userId: number) => {
                return await updateTeamMemberMotive(userId, "Noch keine Motivation angegeben");
            },
            role: async (userId: number) => {
                return await updateTeamMemberRole(userId, ""); // No role is the default value for reset
            },
            secondaryPicture: async (userId: number) => {
                return await updateTeamMemberSecondaryPicture(userId, null);
            },
        };

        const editOptions = {
            profession: async (userId: number, newValue: string) => {
                return await updateTeamMemberProfession(userId, newValue);
            },
            motive: async (userId: number, newValue: string) => {
                return await updateTeamMemberMotive(userId, newValue);
            },
            role: async (userId: number, newValue: string) => {
                return await updateTeamMemberRole(userId, newValue);
            },
            secondaryPicture: async (userId: number, newValue: string) => {
                return await updateTeamMemberSecondaryPicture(userId, newValue);
            },
        };

        for (const command of commands) {
            if (command.executionType === "reset") {
                const result = await resetOptions[command.fieldType](user.id);

                if (result.error !== null) {
                    throw new Error(result.error);
                }
            } else if (command.executionType === "edit" && command.fieldType === "secondaryPicture") {
                if (command.newUrl === user.secondaryPicture) {
                    console.info("Skipping profile picture update for user with id " + user.id + " since the new URL is the same as the current one.");
                    continue;
                }

                const result = await editOptions[command.fieldType](user.id, command.newUrl);

                if (result.error !== null) {
                    throw new Error(result.error);
                }
            } else if (command.executionType === "edit") {
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

        const updatedUserData = await getTeamMemberWithUserData(user.id);

        if (updatedUserData.error !== null) {
            throw new Error("Der Benutzer konnte zwar erfolgreich aktualisiert werden, aber die aktualisierten Daten konnten nicht abgerufen werden: " + updatedUserData.error);
        }

        res.json({
            error: false,
            message: `Success`,
            data: updatedUserData.data[0],
        } as UpdateTeamMemberWithIdApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as UpdateTeamMemberWithIdApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as UpdateTeamMemberWithIdApiEndpointResponse);
    }
});

export default router;
