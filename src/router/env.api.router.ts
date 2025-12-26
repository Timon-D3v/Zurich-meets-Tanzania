import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, PublicEnvVariables } from "..";
import { CONFIG } from "../config";

// Router Serves under /api/env
const router = Router();

router.get("/:env", (req: Request, res: Response): void => {
    try {
        const { env } = req.params;

        const allowedEnvVariables: PublicEnvVariables = {
            ORIGIN: CONFIG.ORIGIN,
            ENV: CONFIG.ENV,
        };

        if (!Object.keys(allowedEnvVariables).includes(env)) {
            throw new Error("This Variable is not present or public.");
        }

        res.json({
            error: false,
            message: allowedEnvVariables[env as "ORIGIN" | "ENV"],
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
