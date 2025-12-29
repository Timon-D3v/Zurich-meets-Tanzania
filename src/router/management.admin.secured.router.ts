import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, GetPasswordsApiEndpointResponse } from "../index.js";
import { PASSWORDS } from "../shared/passwords";
import { getUserWithEmail, setUserType } from "../shared/user.database";

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

router.post("/addAdmin", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Bitte gib eine gültige E-Mail-Adresse ein.");
        }

        const user = await getUserWithEmail(email);

        if (user.error !== null) {
            throw new Error(user.error);
        }

        if (user.data.length === 0) {
            throw new Error("Es existiert kein Benutzer mit dieser E-Mail-Adresse.");
        }

        if (user.data[0].type === "admin") {
            throw new Error("Der Benutzer ist bereits ein Admin.");
        }

        const result = await setUserType(email, "admin");

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Der Benutzer wurde erfolgreich zum Admin ernannt.",
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
