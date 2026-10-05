import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, DatabaseApiEndpointResponse, DelivApiFile } from "..";
import { createGallery, getAllGalleryTitles, getGalleryWithTitle, removeGallery, updateGalleryImages, updateGalleryDetails, getAllGalleryTitlesAndSubtitles } from "../shared/gallery.database";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";

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

router.get("/getAllGalleryTitlesAndSubtitles", async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getAllGalleryTitlesAndSubtitles();

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

router.post("/updateGalleryImages", multerInstance.array("files"), async (req: Request, res: Response): Promise<void> => {
    try {
        const title = req.body?.title;
        const urls = req.body?.urls;
        const files = req.files || [];

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Der Name der Galerie ist nicht gültig.");
        }

        if (!Array.isArray(urls) || urls.some((url) => typeof url !== "string" || url.trim() === "")) {
            throw new Error("Es sind nicht alle URLs der Bilder gültig.");
        }

        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new Error("Es wurden keine Bilder hochgeladen.");
        }

        if (files.length !== urls.length) {
            throw new Error("Die Anzahl der hochgeladenen Bilder stimmt nicht mit der Anzahl der URLs überein.");
        }

        if (!Array.isArray(files)) {
            throw new Error("Image list is not valid.");
        }

        const allowedMimeTypes = [
            "application/octet-stream",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/jpeg",
            "image/tiff",
            "image/raw",
            "image/bpm",
            "image/webp",
            "image/ico",
            "application/pdf",
            "image/svg+xml",
            "video/mp4",
            "video/quicktime",
            "video/webm",
            "video/x-msvideo",
            "video/mpeg",
            "video/x-matroska",
        ];

        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                console.error("Invalid file mime type for file:", file.originalname, "with mime type:", file.mimetype);
                throw new Error(`Die Datei '${file.originalname}' ist keine gültige Bilddatei. Bitte lade nur Bilddateien hoch.`);
            }
        }

        const result = await getGalleryWithTitle(title);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        if (result.data.length === 0) {
            throw new Error(`Die Galerie mit dem Titel '${title}' konnte nicht gefunden werden.`);
        }

        // Validation complete

        let failedUploads = 0;

        const originalFiles = result.data[0].data as DelivApiFile[];

        const delivApiFiles: DelivApiFile[] = [];

        for (let i = 0; i < urls.length; i++) {
            if (urls[i].startsWith("blob:")) {
                try {
                    // The index of the file has to be the same as the one for the url
                    const file = files[i];

                    const response = await delivApiUpload(file.buffer);

                    if (response.error) {
                        // Don't abort, just set fallback image
                        throw new Error(response.message);
                    }

                    delivApiFiles.push({
                        url: response.url,
                        uuid: response.url.split("/").pop() || response.url,
                        mimetype: file.mimetype,
                    });
                } catch (error) {
                    console.error("Error uploading image:", (error as Error).message);

                    failedUploads++;
                }
            } else {
                // Files are already uploaded => Use the stored data
                const storedFile = originalFiles.find((file) => file.url === urls[i]);

                if (!storedFile) {
                    throw new Error(`Die Datei mit der URL '${urls[i]}' konnte nicht in der Galerie gefunden werden und ist auch keine neue Datei.`);
                }

                delivApiFiles.push(storedFile);
            }
        }

        // All images uploaded (or failed) => update the gallery in the database
        const updateResult = await updateGalleryImages(title, delivApiFiles);

        if (updateResult.error !== null) {
            throw new Error(updateResult.error);
        }

        res.json({
            error: false,
            message:
                failedUploads === 0
                    ? `Die Galerie mit Titel '${title}' wurde erfolgreich aktualisiert.`
                    : `Die Galerie mit Titel '${title}' wurde aktualisiert, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden. Bitte lade die fehlgeschlagenen Bilder erneut hoch.`,
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

router.post("/updateGalleryDetails", async (req: Request, res: Response): Promise<void> => {
    try {
        const title = req.body?.title;
        const newTitle = req.body?.newTitle;
        const newSubtitle = req.body?.newSubtitle;

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Der Name der Galerie ist nicht gültig.");
        }

        if (typeof newTitle !== "string" || newTitle.trim() === "") {
            throw new Error("Der neue Name der Galerie ist nicht gültig.");
        }

        const allGalleryTitlesResult = await getAllGalleryTitles();

        if (allGalleryTitlesResult.error !== null) {
            throw new Error(allGalleryTitlesResult.error);
        }

        const allGalleryTitles = (allGalleryTitlesResult.data as { title: string }[]).map((entry) => entry.title).filter((existingTitle) => existingTitle !== title); // Exclude the current title from the list of existing titles

        if (allGalleryTitles.includes(newTitle)) {
            throw new Error(`Der Name '${newTitle}' wird bereits von einer anderen Galerie verwendet. Bitte wähle einen anderen Galerie-Namen.`);
        }

        if (typeof newSubtitle !== "string" || newSubtitle.trim() === "") {
            throw new Error("Der neue Untertitel der Galerie ist nicht gültig.");
        }

        const result = await updateGalleryDetails(title, newTitle, newSubtitle);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Die Galerie wurde erfolgreich aktualisiert.",
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
