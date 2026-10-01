import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, DatabaseApiEndpointResponse } from "..";
import { createGallery, getAllGalleryTitles, removeGallery } from "../shared/gallery.database";

// Router Serves under /api/secured/admin/gallery
const router = Router();

router.post("/addGallery", async (req: Request, res: Response): Promise<void> => {
    try {
        const title = req.body?.title;
        const subtitle = req.body?.subtitle;

        const allGalleryTitlesResult = await getAllGalleryTitles();

        if (allGalleryTitlesResult.error !== null) {
            throw new Error(allGalleryTitlesResult.error);
        }

        const allGalleryTitles = (allGalleryTitlesResult.data as { title: string }[]).map((entry) => entry.title);

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Der Name der Galerie ist nicht gültig.");
        }

        if (allGalleryTitles.includes(title)) {
            throw new Error(`Der Name '${title}' wird bereits von einer anderen Galerie verwendet. Bitte wähle einen anderen Galerie-Namen.`);
        }

        if (typeof subtitle !== "string" || subtitle.trim() === "") {
            throw new Error("Der Untertitel der Galerie ist nicht gültig.");
        }

        const result = await createGallery(title, subtitle);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Die Galerie wurde erfolgreich erstellt.",
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

router.post("/removeGallery", async (req: Request, res: Response): Promise<void> => {
    try {
        const title = req.body?.title;

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Der Name der Galerie ist nicht gültig.");
        }

        const result = await removeGallery(title);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Die Galerie wurde erfolgreich entfernt.",
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

router.get("/getAllGalleryTitles", async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getAllGalleryTitles();

        res.json({
            error: false,
            message: "Success",
            data: result,
        } as DatabaseApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as DatabaseApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as DatabaseApiEndpointResponse);
    }
});

export default router;
