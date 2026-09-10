import { Request, Response, Router } from "express";
import { getLastXGalleryTitles, getGalleryWithTitle } from "../shared/gallery.database";
import { DatabaseResult, GetGalleryImagesApiEndpointResponse } from "..";

// Router Serves under /api/gallery
const router = Router();

router.get("/getLinks/:count", async (req: Request, res: Response): Promise<void> => {
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

router.post("/getGalleryImages", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        if (typeof name !== "string") {
            throw new Error("Please enter a valid gallery name.");
        }

        const response: DatabaseResult = await getGalleryWithTitle(name);

        if (typeof response.error === "string") {
            throw new Error(response.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: response.data.length === 1 ? response.data[0] : null,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetGalleryImagesApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: "501: Internal Server Error",
            data: null,
        } as GetGalleryImagesApiEndpointResponse);
    }
});

export default router;
