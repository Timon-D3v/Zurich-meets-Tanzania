import { Request, Response, Router } from "express";
import { DatabaseResult, GetTeamApiEndpointResponse, AssembledTeam, TeamMember } from "..";
import { PUBLIC_CONFIG } from "../publicConfig.js";
import { getCurrentTeam, getTeam, getTeamMembers } from "../shared/team.database.js";
import { getBoard } from "../shared/board.database.js";

// Router Serves under /api/team
const router = Router();

router.get("/getCurrentTeam", async (req: Request, res: Response): Promise<void> => {
    try {
        const response: DatabaseResult = await getCurrentTeam();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        const members = await getTeamMembers(response.data[0].members as number[]);

        if (members.error !== null) {
            throw new Error(members.error);
        }

        const data: AssembledTeam = {
            id: response.data[0].id,
            motto: response.data[0].motto,
            text: response.data[0].text,
            picture: response.data[0].picture,
            members: members.data as TeamMember[],
            date: response.data[0].date,
        };

        res.json({
            error: false,
            message: "Success",
            data: data,
        } as GetTeamApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetTeamApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetTeamApiEndpointResponse);
    }
});

router.get("/getTeam", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;

        if (typeof id !== "string" || isNaN(Number(id)) || Number(id) <= 0 || typeof Number(id) !== "number") {
            throw new Error("Bitte gib eine gültige Team ID an.");
        }

        const response: DatabaseResult = await getTeam(Number(id));

        if (response.error !== null) {
            throw new Error(response.error);
        }

        if (response.data.length === 0) {
            throw new Error("Es wurde kein Team mit dieser ID gefunden.");
        }

        const members = await getTeamMembers(response.data[0].members as number[]);

        if (members.error !== null) {
            throw new Error(members.error);
        }

        const data: AssembledTeam = {
            id: response.data[0].id,
            motto: response.data[0].motto,
            text: response.data[0].text,
            picture: response.data[0].picture,
            members: members.data as TeamMember[],
            date: response.data[0].date,
        };

        res.json({
            error: false,
            message: "Success",
            data: data,
        } as GetTeamApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetTeamApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetTeamApiEndpointResponse);
    }
});

router.get("/getBoard", async (req: Request, res: Response): Promise<void> => {
    try {
        const response: DatabaseResult = await getBoard();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: response.data,
        } as GetTeamApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetTeamApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetTeamApiEndpointResponse);
    }
});

export default router;
