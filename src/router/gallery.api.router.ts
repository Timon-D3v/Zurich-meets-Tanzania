import { Request, Response, Router } from "express";
import { getLastXGalleryTitles } from "../shared/gallery.database";
import { DatabaseResult } from "..";

// Router Serves under /api/blog
const router = Router();

router.post("/getLinks/:count", async (req: Request, res: Response): Promise<void> => {
    try {
        const x = req.params?.["count"];

        if (typeof x !== "string" || typeof Number(x) !== "number") {
            res.status(501).json({
                data: null,
                error: "Please enter valid data.",
            });
        }

        const response: DatabaseResult = await getLastXGalleryTitles(Number(x));

        if (typeof response.error === "string") {
            throw new Error(response.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: response,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            });

            return;
        }

        res.status(501).json({
            error: true,
            message: "501: Internal Server Error",
        });
    }
});

export default router;
