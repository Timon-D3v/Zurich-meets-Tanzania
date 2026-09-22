import { Request, Response, Router } from "express";
import { ApiEndpointResponse, GetLegacyMembersApiEndpointResponse, PrivateUser } from "..";
import { acceptLegacyMember, createLegacyMember, getAllUnverifiedLegacyMembers, rejectLegacyMember } from "../shared/member.database";
import { PUBLIC_CONFIG } from "../publicConfig";
import { getUserWithEmail } from "../shared/user.database";

// Router Serves under /api/secured/admin/membership
const router = Router();

router.get("/getUnverifiedLegacyMembers", async (req: Request, res: Response) => {
    try {
        const result = await getAllUnverifiedLegacyMembers();

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Die unverifizierten Legacy-Mitglieder wurden erfolgreich abgerufen.",
            data: result.data,
        } as GetLegacyMembersApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetLegacyMembersApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetLegacyMembersApiEndpointResponse);
    }
});

router.post("/acceptLegacyMember", async (req: Request, res: Response) => {
    try {
        const { userId, memberId } = req.body;

        if (!userId || !memberId) {
            throw new Error("Missing required parameters: userId and memberId are required.");
        }

        if (typeof userId !== "number" || isNaN(userId)) {
            throw new Error("Invalid parameter: userId must be a valid number.");
        }

        if (typeof memberId !== "number" || isNaN(memberId)) {
            throw new Error("Invalid parameter: memberId must be a valid number.");
        }

        const result = await acceptLegacyMember(userId, memberId);

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Das Mitglied wurde erfolgreich akzeptiert.",
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

router.post("/rejectLegacyMember", async (req: Request, res: Response) => {
    try {
        const { userId, memberId } = req.body;

        if (!userId || !memberId) {
            throw new Error("Missing required parameters: userId and memberId are required.");
        }

        if (typeof userId !== "number" || isNaN(userId)) {
            throw new Error("Invalid parameter: userId must be a valid number.");
        }

        if (typeof memberId !== "number" || isNaN(memberId)) {
            throw new Error("Invalid parameter: memberId must be a valid number.");
        }

        const result = await rejectLegacyMember(userId, memberId);

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Das Mitglied wurde erfolgreich abgelehnt.",
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

router.post("/createLegacyMembership", async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body?.email;

        if (!email || typeof email !== "string" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email)) {
            throw new Error("Missing or invalid parameter: email is required and must be a valid email address.");
        }

        const userResult = await getUserWithEmail(email);

        if (userResult.error || userResult.data === null || userResult.data.length === 0) {
            throw new Error("Der Benutzer mit dieser E-Mail-Adresse existiert nicht.");
        }

        const user = userResult.data[0] as PrivateUser;

        if (user.type === "admin" || user.type === "member") {
            throw new Error("Der Benutzer ist bereits ein Mitglied oder Admin und kann daher nicht als Manuelles Mitglied aufgenommen werden.");
        }

        const now = Date.now();
        const periodEnd = new Date(`${new Date(now).getFullYear() + 1}-01-01T12:00:00Z`).getTime();

        // Store the request in the database
        const result = await createLegacyMember(user.id, now, periodEnd, now, "verified");

        if (result.error) {
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
