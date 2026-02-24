import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { GetVisitorCountsApiEndpointResponse } from "..";
import { getLastXDaysVisitorCounts } from "../shared/analytics";

// Router Serves under /api/secured/admin/analytics
const router = Router();

router.post("/getVisitorCount", async (req: Request, res: Response): Promise<void> => {
    try {
        const { days } = req.body;

        if (typeof days !== "number" || isNaN(days) || days <= 0) {
            throw new Error("Bitte gib eine gültige Anzahl an Tagen ein.");
        }

        const visitorCounts = await getLastXDaysVisitorCounts(days);

        res.json({
            error: false,
            message: `Success`,
            data: visitorCounts,
        } as GetVisitorCountsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetVisitorCountsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetVisitorCountsApiEndpointResponse);
    }
});

export default router;
