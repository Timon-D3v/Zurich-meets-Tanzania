import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, Blog, BlogContent, DatabaseApiEndpointResponse, GetAllBlogsApiEndpointResponse } from "..";
import { createBlog, deleteBlog, getAllBlogs, getAllBlogTitles, updateBlog } from "../shared/blog.database";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";

// Router Serves under /api/secured/admin/blog
const router = Router();

router.get("/getAllBlogs", async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getAllBlogs();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        const blogData = response.data as Blog[];

        res.json({
            error: false,
            message: "Success",
            data: blogData,
        } as GetAllBlogsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetAllBlogsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetAllBlogsApiEndpointResponse);
    }
});

router.get("/getAllTitles", async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getAllBlogTitles();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: response,
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

router.post("/createBlog", multerInstance.array("images"), async (req: Request, res: Response): Promise<void> => {
    try {
        const blogName = req.body.blogName; // The new name of the blog
        const blog = JSON.parse(req.body.blog);
        const imageNames = JSON.parse(req.body.imageNames);
        const files = req.files || [];

        const allBlogTitlesResult = await getAllBlogTitles();

        if (allBlogTitlesResult.error !== null) {
            throw new Error(allBlogTitlesResult.error);
        }

        const allBlogTitles = (allBlogTitlesResult.data as { title: string }[]).map((entry) => entry.title);

        if (
            typeof blogName !== "string"
            // Don't check for existence here, since it's a new blog
        ) {
            throw new Error("BlogName is not valid.");
        }

        if (blogName === "new-blog" || blogName === "awaitSelection") {
            throw new Error(`Der Name '${blogName}' ist reserviert und kann nicht verwendet werden. Bitte wähle einen anderen Blog-Namen.`);
        }

        if (allBlogTitles.includes(blogName)) {
            throw new Error(`Der Name '${blogName}' wird bereits von einem anderen Blog verwendet. Bitte wähle einen anderen Blog-Namen.`);
        }

        if (typeof blog !== "object" || blog === null) {
            throw new Error("Blog structure is not valid.");
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

        if (
            typeof blog.metadata !== "object" ||
            typeof blog.metadata.title !== "string" ||
            typeof blog.metadata.subtitle !== "string" ||
            typeof blog.metadata.author !== "string" ||
            typeof blog.metadata.imageUrl !== "string" ||
            typeof blog.metadata.imageAlt !== "string"
        ) {
            throw new Error("Blog Metadata is not valid");
        }

        if (!Array.isArray(blog.data)) {
            throw new Error("Blog Data is not valid");
        }

        const { data, metadata } = blog as BlogContent;

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

        // Validation recap
        // - blogName is valid and not already used
        // - blogName is not "new-blog" or "awaitSelection"
        // - blog is an object
        // - imageNames is an array of strings
        // - files is an array
        // - blog metadata is valid
        // - blog data is valid
        // - all files have valid mime types

        // Upload images

        let failedUploads = 0;

        // Check hero image and then loop over the rest
        if (imageNames.includes(metadata.imageUrl)) {
            try {
                const fileIndex = imageNames.indexOf(metadata.imageUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(file.buffer);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                metadata.imageUrl = response.url;
            } catch (error) {
                console.error("Error uploading image:", (error as Error).message);

                failedUploads++;

                metadata.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
            }
        }

        for (const element of data) {
            if (element.type === "image" || element.type === "imageWithText") {
                if (imageNames.includes(element.imageUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.imageUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(file.buffer);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.imageUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading image:", (error as Error).message);

                        failedUploads++;

                        element.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                    }
                }
            } else if (element.type === "multipleImages") {
                for (const image of element.images) {
                    if (imageNames.includes(image.imageUrl)) {
                        try {
                            const fileIndex = imageNames.indexOf(image.imageUrl);

                            const file = files[fileIndex];

                            const response = await delivApiUpload(file.buffer);

                            if (response.error) {
                                // Don't abort, just set fallback image
                                throw new Error(response.message);
                            }

                            image.imageUrl = response.url;
                        } catch (error) {
                            console.error("Error uploading image:", (error as Error).message);

                            failedUploads++;

                            image.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                        }
                    }
                }
            } else if (element.type === "video") {
                if (imageNames.includes(element.videoUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.videoUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(file.buffer);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.videoUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading video:", (error as Error).message);

                        failedUploads++;

                        element.videoUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL; // Videos don't have a fallback, so we use the fallback image instead
                    }
                }
            } else if (element.type === "pdfViewer") {
                if (imageNames.includes(element.pdfUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.pdfUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(file.buffer);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.pdfUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading pdf:", (error as Error).message);

                        failedUploads++;

                        element.pdfUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL; // PDFs don't have a fallback, so we use the fallback image instead
                    }
                }
            } else if (element.type === "table") {
                for (const header of element.headers) {
                    if (header.type === "image" && imageNames.includes(header.imageUrl)) {
                        try {
                            const fileIndex = imageNames.indexOf(header.imageUrl);

                            const file = files[fileIndex];

                            const response = await delivApiUpload(file.buffer);

                            if (response.error) {
                                // Don't abort, just set fallback image
                                throw new Error(response.message);
                            }

                            header.imageUrl = response.url;
                        } catch (error) {
                            console.error("Error uploading image:", (error as Error).message);

                            failedUploads++;

                            header.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                        }
                    }
                }

                for (const row of element.rows) {
                    for (const cell of row) {
                        if (cell.type === "image" && imageNames.includes(cell.imageUrl)) {
                            try {
                                const fileIndex = imageNames.indexOf(cell.imageUrl);

                                const file = files[fileIndex];

                                const response = await delivApiUpload(file.buffer);

                                if (response.error) {
                                    // Don't abort, just set fallback image
                                    throw new Error(response.message);
                                }

                                cell.imageUrl = response.url;
                            } catch (error) {
                                console.error("Error uploading image:", (error as Error).message);

                                failedUploads++;

                                cell.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                            }
                        }
                    }
                }
            }
        }

        // All images uploaded (or failed), now save the blog structure
        const result = await createBlog(blogName, { metadata, data });

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message:
                failedUploads === 0
                    ? `Der Blog mit Titel '${blogName}' wurde erfolgreich erstellt.`
                    : `Der Blog mit Titel '${blogName}' wurde erstellt, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt.`,
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

router.post("/updateBlog", multerInstance.array("images"), async (req: Request, res: Response): Promise<void> => {
    try {
        const blogName = req.body.blogName; // The old name of the blog to identify it
        const blog = JSON.parse(req.body.blog);
        const imageNames = JSON.parse(req.body.imageNames);
        const files = req.files || [];

        const allBlogTitlesResult = await getAllBlogTitles();

        if (allBlogTitlesResult.error !== null) {
            throw new Error(allBlogTitlesResult.error);
        }

        const allBlogTitles = (allBlogTitlesResult.data as { title: string }[]).map((entry) => entry.title);

        if (typeof blogName !== "string" || !allBlogTitles.includes(blogName)) {
            throw new Error("BlogName is not valid.");
        }

        if (typeof blog !== "object" || blog === null) {
            throw new Error("Blog structure is not valid.");
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

        if (
            typeof blog.metadata !== "object" ||
            typeof blog.metadata.title !== "string" ||
            typeof blog.metadata.subtitle !== "string" ||
            typeof blog.metadata.author !== "string" ||
            typeof blog.metadata.imageUrl !== "string" ||
            typeof blog.metadata.imageAlt !== "string"
        ) {
            throw new Error("Blog Metadata is not valid");
        }

        if (!Array.isArray(blog.data)) {
            throw new Error("Blog Data is not valid");
        }

        if (blog.metadata.title === "new-blog" || blog.metadata.title === "awaitSelection") {
            throw new Error(`Der Name '${blog.metadata.title}' ist reserviert und kann nicht verwendet werden. Bitte wähle einen anderen Blog-Namen.`);
        }

        if (allBlogTitles.filter((title) => title !== blogName).includes(blog.metadata.title)) {
            throw new Error(`Der Name '${blog.metadata.title}' wird bereits von einem anderen Blog verwendet. Bitte wähle einen anderen Blog-Namen.`);
        }

        const { data, metadata } = blog as BlogContent;

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

        // Validation recap
        // - blogName is a valid blog
        // - blog is an object
        // - imageNames is an array of strings
        // - files is an array
        // - blog metadata is valid
        // - blog data is valid
        // - all files have valid mime types
        // - blog title is not "new-blog" or "awaitSelection"
        // - blog title is not already used by another blog (except itself)

        // Upload images

        let failedUploads = 0;

        // Check hero image and then loop over the rest
        if (imageNames.includes(metadata.imageUrl)) {
            try {
                const fileIndex = imageNames.indexOf(metadata.imageUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(file.buffer);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                metadata.imageUrl = response.url;
            } catch (error) {
                console.error("Error uploading image:", (error as Error).message);

                failedUploads++;

                metadata.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
            }
        }

        for (const element of data) {
            if (element.type === "image" || element.type === "imageWithText") {
                if (imageNames.includes(element.imageUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.imageUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(file.buffer);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.imageUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading image:", (error as Error).message);

                        failedUploads++;

                        element.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                    }
                }
            } else if (element.type === "multipleImages") {
                for (const image of element.images) {
                    if (imageNames.includes(image.imageUrl)) {
                        try {
                            const fileIndex = imageNames.indexOf(image.imageUrl);

                            const file = files[fileIndex];

                            const response = await delivApiUpload(file.buffer);

                            if (response.error) {
                                // Don't abort, just set fallback image
                                throw new Error(response.message);
                            }

                            image.imageUrl = response.url;
                        } catch (error) {
                            console.error("Error uploading image:", (error as Error).message);

                            failedUploads++;

                            image.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                        }
                    }
                }
            } else if (element.type === "video") {
                if (imageNames.includes(element.videoUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.videoUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(file.buffer);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.videoUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading video:", (error as Error).message);

                        failedUploads++;

                        element.videoUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL; // Videos don't have a fallback, so we use the fallback image instead
                    }
                }
            } else if (element.type === "pdfViewer") {
                if (imageNames.includes(element.pdfUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.pdfUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(file.buffer);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.pdfUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading pdf:", (error as Error).message);

                        failedUploads++;

                        element.pdfUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL; // PDFs don't have a fallback, so we use the fallback image instead
                    }
                }
            } else if (element.type === "table") {
                for (const header of element.headers) {
                    if (header.type === "image" && imageNames.includes(header.imageUrl)) {
                        try {
                            const fileIndex = imageNames.indexOf(header.imageUrl);

                            const file = files[fileIndex];

                            const response = await delivApiUpload(file.buffer);

                            if (response.error) {
                                // Don't abort, just set fallback image
                                throw new Error(response.message);
                            }

                            header.imageUrl = response.url;
                        } catch (error) {
                            console.error("Error uploading image:", (error as Error).message);

                            failedUploads++;

                            header.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                        }
                    }
                }

                for (const row of element.rows) {
                    for (const cell of row) {
                        if (cell.type === "image" && imageNames.includes(cell.imageUrl)) {
                            try {
                                const fileIndex = imageNames.indexOf(cell.imageUrl);

                                const file = files[fileIndex];

                                const response = await delivApiUpload(file.buffer);

                                if (response.error) {
                                    // Don't abort, just set fallback image
                                    throw new Error(response.message);
                                }

                                cell.imageUrl = response.url;
                            } catch (error) {
                                console.error("Error uploading image:", (error as Error).message);

                                failedUploads++;

                                cell.imageUrl = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;
                            }
                        }
                    }
                }
            }
        }

        // All images uploaded (or failed), now save the blog structure
        const result = await updateBlog(blogName, { metadata, data });

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message:
                failedUploads === 0
                    ? `Der Blog mit Titel '${blogName}' wurde erfolgreich aktualisiert. (Neuer Titel: '${blog.metadata.title}')`
                    : `Der Blog mit Titel '${blogName}' wurde aktualisiert, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt. (Neuer Titel: '${blog.metadata.title}')`,
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

router.post("/deleteBlog", async (req: Request, res: Response): Promise<void> => {
    try {
        const blogName = req.body.blogName; // The name of the blog to identify it

        const allBlogTitlesResult = await getAllBlogTitles();

        if (allBlogTitlesResult.error !== null) {
            throw new Error(allBlogTitlesResult.error);
        }

        const allBlogTitles = (allBlogTitlesResult.data as { title: string }[]).map((entry) => entry.title);

        if (typeof blogName !== "string" || !allBlogTitles.includes(blogName)) {
            throw new Error("Es wurde kein Blog mit dem angegebenen Namen gefunden.");
        }

        const result = await deleteBlog(blogName);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: `Der Blog mit dem Titel '${blogName}' wurde erfolgreich gelöscht.`,
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
