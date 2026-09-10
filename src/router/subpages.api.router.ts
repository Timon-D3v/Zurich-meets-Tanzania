import { Request, Response, Router } from "express";
import { DatabaseResult, GetStaticSiteApiEndpointResponse } from "..";
import { getStaticSite } from "../shared/subpages.database";
import { PUBLIC_CONFIG } from "../publicConfig";

// Router Serves under /api/subpages
const router = Router();

router.get("/get/:title", async (req: Request, res: Response): Promise<void> => {
    try {
        const title = req.params?.["title"];

        if (typeof title !== "string") {
            throw new Error("Title parameter is missing or invalid.");
        }

        if (
            ![
                "vision",
                "board",
                "beginning",
                "finances",
                "income-statement",
                "general-meeting",
                "statutes",
                "zurich-meets-tanzania",
                "tanzania-meets-zurich",
                "mbuzi",
                "gynecology",
                "meducation",
                "bajaji",
                "cardiology",
                "surgery",
                "history",
            ].includes(title)
        ) {
            throw new Error(`No Subpage for title '${title}' found.`);
        }

        const response: DatabaseResult = await getStaticSite(
            title as
                | "vision"
                | "board"
                | "beginning"
                | "finances"
                | "income-statement"
                | "general-meeting"
                | "statutes"
                | "zurich-meets-tanzania"
                | "tanzania-meets-zurich"
                | "mbuzi"
                | "gynecology"
                | "meducation"
                | "bajaji"
                | "cardiology"
                | "surgery"
                | "history",
        );

        if (response.error !== null) {
            throw new Error(response.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: {
                site: response.data[0].data,
                date: response.data[0].date,
            },
        } as GetStaticSiteApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetStaticSiteApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetStaticSiteApiEndpointResponse);
    }
});

export default router;
