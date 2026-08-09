import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse } from "..";
import { createLegacyMember } from "../shared/member.database";
import { sendLegacyMemberRequestEmail } from "../shared/member.email";

// Router Serves under /api/secured/membership
const router = Router();

router.get("/submitLegacyMembershipForm", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.session.user!;

        const now = Date.now();
        const periodEnd = new Date(`${new Date(now).getFullYear() + 1}-01-01T12:00:00Z`).getTime();

        // Store the request in the database
        const result = await createLegacyMember(user.id, now, periodEnd, now);

        if (result.error) {
            throw new Error(result.error);
        }

        // Send an email to the admins with the details of the membership request

        const isSent = await sendLegacyMemberRequestEmail(user.firstName, user.lastName, user.email);

        if (!isSent) {
            throw new Error(PUBLIC_CONFIG.ERROR.INTERNAL_ERROR);
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
