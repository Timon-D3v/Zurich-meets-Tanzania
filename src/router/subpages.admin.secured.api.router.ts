import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, GetAllStaticSitesApiEndpointResponse, StaticSite, StaticSiteStorage } from "..";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";
import { CONFIG } from "../config";
import { getAllStaticSites, updateStaticSite } from "../shared/subpages.database";

// Router Serves under /api/secured/admin/subpages
const router = Router();

router.post("/updateStaticSite", multerInstance.array("images"), async (req: Request, res: Response): Promise<void> => {
    try {
        const siteName = req.body.siteName;
        const site = JSON.parse(req.body.site);
        const imageNames = JSON.parse(req.body.imageNames);
        const files = req.files || [];

        if (
            typeof siteName !== "string" ||
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
            ].includes(siteName)
        ) {
            throw new Error("SiteName is not valid.");
        }

        if (typeof site !== "object" || site === null) {
            throw new Error("Site structure is not valid.");
        }

        if (!Array.isArray(imageNames)) {
            throw new Error("Image names list is not valid.");
        }

        for (const imageName of imageNames) {
            if (typeof imageName !== "string" || imageName.trim() === "") { // The imageName is the URL of the image, so it can't be empty
                throw new Error("Image names list is not valid.");
            }
        }

        if (!Array.isArray(files)) {
            throw new Error("Image list is not valid.");
        }

        if (
            typeof site.metadata !== "object" ||
            typeof site.metadata.title !== "string" ||
            typeof site.metadata.subtitle !== "string" ||
            typeof site.metadata.author !== "string" ||
            typeof site.metadata.imageUrl !== "string" ||
            typeof site.metadata.imageAlt !== "string"
        ) {
            throw new Error("Site Metadata is not valid");
        }

        if (!Array.isArray(site.data)) {
            throw new Error("Site Data is not valid");
        }

        const { data, metadata } = site as StaticSite;

        const allowedMimeTypes = ["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico"];

        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                console.error("Invalid file mime type for file:", file.originalname, "with mime type:", file.mimetype);
                throw new Error(`Die Datei '${file.originalname}' ist keine gültige Bilddatei. Bitte lade nur Bilddateien hoch.`);
            }
        }

        // Validation recap
        // - siteName is valid
        // - site is an object
        // - imageNames is an array of strings
        // - files is an array
        // - site metadata is valid
        // - site data is valid
        // - all files have valid mime types

        const IMAGE_FALLBACK_URL = "/backup/fallback.png";

        // Upload images

        let failedUploads = 0;

        // Check hero image and then loop over the rest
        if (imageNames.includes(metadata.imageUrl)) {
            try {
                const fileIndex = imageNames.indexOf(metadata.imageUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                metadata.imageUrl = response.url;
            } catch (error) {
                console.error("Error uploading image:", (error as Error).message);

                failedUploads++;

                metadata.imageUrl = IMAGE_FALLBACK_URL;
            }
        }

        for (const element of data) {
            if (element.type === "image" || element.type === "imageWithText") {
                if (imageNames.includes(element.imageUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.imageUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.imageUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading image:", (error as Error).message);

                        failedUploads++;

                        element.imageUrl = IMAGE_FALLBACK_URL;
                    }
                }
            } else if (element.type === "multipleImages") {
                for (const image of element.images) {
                    if (imageNames.includes(image.imageUrl)) {
                        try {
                            const fileIndex = imageNames.indexOf(image.imageUrl);

                            const file = files[fileIndex];

                            const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                            if (response.error) {
                                // Don't abort, just set fallback image
                                throw new Error(response.message);
                            }

                            image.imageUrl = response.url;
                        } catch (error) {
                            console.error("Error uploading image:", (error as Error).message);

                            failedUploads++;

                            image.imageUrl = IMAGE_FALLBACK_URL;
                        }
                    }
                }
            }
        }

        // All images uploaded (or failed), now save the site structure
        const result = await updateStaticSite(
            siteName as
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
            { metadata, data },
        );

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message:
                failedUploads === 0
                    ? `Die Seite mit id '${siteName}' wurde erfolgreich aktualisiert.`
                    : `Die Seite mit id '${siteName}' wurde aktualisiert, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt.`,
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

router.get("/getAllStaticSites", async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getAllStaticSites();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        const staticSiteData = response.data as StaticSiteStorage[];

        res.json({
            error: false,
            message: "Success",
            data: staticSiteData,
        } as GetAllStaticSitesApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetAllStaticSitesApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetAllStaticSitesApiEndpointResponse);
    }
});

export default router;
