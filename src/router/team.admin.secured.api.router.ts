import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, PrivateUser, Team, TeamMember } from "..";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";
import { CONFIG } from "../config";
import { createTeam, getCurrentTeam, updateMembers, getTeamMemberEntry, createTeamMemberEntry } from "../shared/team.database";
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

router.post("/addMember", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
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

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
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

export default router;
