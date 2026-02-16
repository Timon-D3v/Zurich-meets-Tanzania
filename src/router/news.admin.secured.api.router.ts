import { Request, Response, Router } from "express";
import { createNews, getAllNews, updateNews } from "../shared/news.database";
import { ApiEndpointResponse, GetAllNewsApiEndpointResponse, News, NewsContent } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";
import { CONFIG } from "../config";
import { sendNewsletterForNews } from "../shared/newsletter.email";

// Router Serves under /api/secured/admin/news
const router = Router();

router.get("/getAllNews", async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getAllNews();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        const newsData = response.data as News[];

        res.json({
            error: false,
            message: "Success",
            data: newsData,
        } as GetAllNewsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetAllNewsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetAllNewsApiEndpointResponse);
    }
});

router.post("/createNews", multerInstance.array("images"), async (req: Request, res: Response): Promise<void> => {
    try {
        const newsContent = JSON.parse(req.body.newsContent);
        const imageNames = JSON.parse(req.body.imageNames);
        const sendNewsletter = req.body.sendNewsletter;
        const files = req.files || [];

        if (!["true", "false"].includes(sendNewsletter)) {
            throw new Error(`SendNewsletter value is not valid.`);
        }

        if (typeof newsContent !== "object" || newsContent === null) {
            throw new Error("News structure is not valid.");
        }

        if (!Array.isArray(imageNames)) {
            throw new Error("Image names list is not valid.");
        }

        for (const imageName of imageNames) {
            if (typeof imageName !== "string" || imageName.trim() === "") {
                // The imageName is the URL of the image, so it can't be empty
                throw new Error("Image names list is not valid.");
            }
        }

        if (!Array.isArray(files)) {
            throw new Error("Image list is not valid.");
        }

        if (typeof newsContent.type !== "string" || !["image", "pdf", "multipleImages"].includes(newsContent.type)) {
            throw new Error("News type is not valid.");
        }

        if (!Array.isArray(newsContent.content)) {
            throw new Error("News content is not valid");
        }

        const news = newsContent as NewsContent;

        if (news.type === "image" && (typeof news.imageUrl !== "string" || typeof news.imageAlt !== "string" || !["left", "center", "right"].includes(news.imagePosition))) {
            throw new Error("News image metadata is not valid.");
        }

        if (news.type === "pdf" && typeof news.pdfUrl !== "string") {
            throw new Error("News PDF metadata is not valid.");
        }

        const allowedMimeTypes = ["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico", "application/pdf"];

        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                console.error("Invalid file mime type for file:", file.originalname, "with mime type:", file.mimetype);
                throw new Error(`Die Datei '${file.originalname}' ist keine gültige Bilddatei. Bitte lade nur Bilddateien hoch.`);
            }
        }

        // Validation recap
        // - sendNewsletter is "true" or "false"
        // - newsContent is an object
        // - imageNames is an array of strings
        // - files is an array
        // - news metadata is valid
        // - news data is valid
        // - all files have valid mime types

        const IMAGE_FALLBACK_URL = "/backup/fallback.png";

        // Upload images

        let failedUploads = 0;

        if (news.type === "image" && imageNames.includes(news.imageUrl)) {
            try {
                const fileIndex = imageNames.indexOf(news.imageUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                news.imageUrl = response.url;
            } catch (error) {
                console.error("Error uploading image:", (error as Error).message);

                failedUploads++;

                news.imageUrl = IMAGE_FALLBACK_URL;
            }
        }

        if (news.type === "pdf" && imageNames.includes(news.pdfUrl)) {
            try {
                const fileIndex = imageNames.indexOf(news.pdfUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                news.pdfUrl = response.url;
            } catch (error) {
                console.error("Error uploading pdf:", (error as Error).message);

                failedUploads++;

                // This is a image url, but we can still use it since we show the pdf in an iframe and the iframe can also display images
                news.pdfUrl = IMAGE_FALLBACK_URL;
            }
        }

        for (const element of news.content) {
            if (element.type === "multipleImages") {
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

        // All images uploaded (or failed), now save the blog structure
        const result = await createNews(news);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        // News are created successfully, news send the newsletter if the user wanted to
        if (sendNewsletter === "true") {
            const newsletterResult = await sendNewsletterForNews(news);

            if (!newsletterResult) {
                throw new Error("News wurden erstellt, aber der Newsletter konnte nicht versendet werden. Bitte versuche es später erneut.");
            }

            res.json({
                error: false,
                message:
                    failedUploads === 0
                        ? `Die News wurden erstellt und der Newsletter wurde erfolgreich versendet.`
                        : `Die News wurden erstellt und der Newsletter wurde erfolgreich versendet, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt.`,
            } as ApiEndpointResponse);

            return;
        }

        res.json({
            error: false,
            message: failedUploads === 0 ? `Die News wurden erfolgreich erstellt.` : `Die News wurden erfolgreich erstellt, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt.`,
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

router.post("/updateNews", multerInstance.array("images"), async (req: Request, res: Response): Promise<void> => {
    try {
        const newsId = req.body.newsId;
        const newsContent = JSON.parse(req.body.newsContent);
        const imageNames = JSON.parse(req.body.imageNames);
        const sendNewsletter = req.body.sendNewsletter;
        const files = req.files || [];

        if (typeof newsId !== "string" || typeof Number(newsId) !== "number" || isNaN(Number(newsId)) || Number(newsId) <= 0) {
            throw new Error("News ID is not valid.");
        }

        if (!["true", "false"].includes(sendNewsletter)) {
            throw new Error(`SendNewsletter value is not valid.`);
        }

        if (typeof newsContent !== "object" || newsContent === null) {
            throw new Error("News structure is not valid.");
        }

        if (!Array.isArray(imageNames)) {
            throw new Error("Image names list is not valid.");
        }

        for (const imageName of imageNames) {
            if (typeof imageName !== "string" || imageName.trim() === "") {
                // The imageName is the URL of the image, so it can't be empty
                throw new Error("Image names list is not valid.");
            }
        }

        if (!Array.isArray(files)) {
            throw new Error("Image list is not valid.");
        }

        if (typeof newsContent.type !== "string" || !["image", "pdf", "multipleImages"].includes(newsContent.type)) {
            throw new Error("News type is not valid.");
        }

        if (!Array.isArray(newsContent.content)) {
            throw new Error("News content is not valid");
        }

        const news = newsContent as NewsContent;

        if (news.type === "image" && (typeof news.imageUrl !== "string" || typeof news.imageAlt !== "string" || !["left", "center", "right"].includes(news.imagePosition))) {
            throw new Error("News image metadata is not valid.");
        }

        if (news.type === "pdf" && typeof news.pdfUrl !== "string") {
            throw new Error("News PDF metadata is not valid.");
        }

        const allowedMimeTypes = ["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico", "application/pdf"];

        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                console.error("Invalid file mime type for file:", file.originalname, "with mime type:", file.mimetype);
                throw new Error(`Die Datei '${file.originalname}' ist keine gültige Bilddatei. Bitte lade nur Bilddateien hoch.`);
            }
        }

        // Validation recap
        // - newsId is a valid number
        // - sendNewsletter is "true" or "false"
        // - newsContent is an object
        // - imageNames is an array of strings
        // - files is an array
        // - news metadata is valid
        // - news data is valid
        // - all files have valid mime types

        const IMAGE_FALLBACK_URL = "/backup/fallback.png";

        // Upload images

        let failedUploads = 0;

        if (news.type === "image" && imageNames.includes(news.imageUrl)) {
            try {
                const fileIndex = imageNames.indexOf(news.imageUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                news.imageUrl = response.url;
            } catch (error) {
                console.error("Error uploading image:", (error as Error).message);

                failedUploads++;

                news.imageUrl = IMAGE_FALLBACK_URL;
            }
        }

        if (news.type === "pdf" && imageNames.includes(news.pdfUrl)) {
            try {
                const fileIndex = imageNames.indexOf(news.pdfUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                news.pdfUrl = response.url;
            } catch (error) {
                console.error("Error uploading pdf:", (error as Error).message);

                failedUploads++;

                // This is a image url, but we can still use it since we show the pdf in an iframe and the iframe can also display images
                news.pdfUrl = IMAGE_FALLBACK_URL;
            }
        }

        for (const element of news.content) {
            if (element.type === "multipleImages") {
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

        // All images uploaded (or failed), now save the blog structure
        const result = await updateNews(Number(newsId), news);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        // News are created successfully, news send the newsletter if the user wanted to
        if (sendNewsletter === "true") {
            const newsletterResult = await sendNewsletterForNews(news);

            if (!newsletterResult) {
                throw new Error("News wurden aktualisiert, aber der Newsletter konnte nicht versendet werden. Bitte versuche es später erneut.");
            }

            res.json({
                error: false,
                message:
                    failedUploads === 0
                        ? `Die News wurden aktualisiert und der Newsletter wurde erfolgreich versendet.`
                        : `Die News wurden aktualisiert und der Newsletter wurde erfolgreich versendet, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt.`,
            } as ApiEndpointResponse);

            return;
        }

        res.json({
            error: false,
            message:
                failedUploads === 0
                    ? `Die News wurden erfolgreich aktualisiert.`
                    : `Die News wurden erfolgreich aktualisiert, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt.`,
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
