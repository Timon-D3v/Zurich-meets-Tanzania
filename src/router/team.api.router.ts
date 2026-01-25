import { Request, Response, Router } from "express";
import { DatabaseResult, GetTeamApiEndpointResponse } from "..";
import { PUBLIC_CONFIG } from "../publicConfig.js";
import { getCurrentTeam } from "../shared/team.database.js";

// Router Serves under /api/team
const router = Router();

router.get("/getCurrentTeam", async (req: Request, res: Response): Promise<void> => {
    try {
        const response: DatabaseResult = await getCurrentTeam();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: response.data[0],
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
