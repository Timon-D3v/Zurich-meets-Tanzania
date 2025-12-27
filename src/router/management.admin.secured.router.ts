import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { GetPasswordsApiEndpointResponse } from "../index.js";
import { PASSWORDS } from "../shared/passwords";

// Router Serves under /api/secured/admin/management
const router = Router();

router.get("/getPasswords", (req: Request, res: Response): void => {
    try {
        res.json({
            error: false,
            message: "Passwords retrieved successfully",
            data: PASSWORDS,
        } as GetPasswordsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetPasswordsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetPasswordsApiEndpointResponse);
    }
});

export default router;
