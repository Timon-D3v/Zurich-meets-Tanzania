import { Request, Response, Router } from "express";
import { getBlog, getLastXBlogTitles } from "../shared/blog.database";
import { PUBLIC_CONFIG } from "../publicConfig";
import { Blog, BlogMetadata, DatabaseApiEndpointResponse, GetBlogApiEndpointResponse, GetBlogMetadataApiEndpointResponse } from "..";

// Router Serves under /api/blog
const router = Router();

router.get("/getBlog/:title", async (req: Request, res: Response): Promise<void> => {
    try {
        const title = req.params?.["title"];

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Please use a valid blog title.");
        }

        const response = await getBlog(title);

        if (response.error !== null) {
            throw new Error(response.error);
        }

        if (response.data.length === 0) {
            throw new Error(`Kein Blog mit dem Titel "${title}" gefunden.`);
        }

        const blogData = response.data[0] as Blog;

        res.json({
            error: false,
            message: "Success",
            data: blogData,
        } as GetBlogApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetBlogApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetBlogApiEndpointResponse);
    }
});

router.get("/getTitles/:count", async (req: Request, res: Response): Promise<void> => {
    try {
        const x = req.params?.["count"];

        if (typeof x !== "string" || typeof Number(x) !== "number" || isNaN(Number(x)) || Number(x) <= 0) {
            throw new Error("Please use a valid number.");
        }

        const response = await getLastXBlogTitles(Number(x));

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

router.get("/getBlogMetadata/:count", async (req: Request, res: Response): Promise<void> => {
    try {
        const x = req.params?.["count"];

        if (typeof x !== "string" || typeof Number(x) !== "number" || isNaN(Number(x)) || Number(x) <= 0) {
            throw new Error("Please use a valid number.");
        }

        const response = await getLastXBlogTitles(Number(x));

        if (response.error !== null) {
            throw new Error(response.error);
        }

        if (!Array.isArray(response.data) || response.data.length === 0) {
            throw new Error("No metadata found.")
        }

        const metadataList: BlogMetadata[] = []

        for (const item of response.data) {
            if (typeof item["title"] !== "string") {
                throw new Error("Invalid blog metadata.");
            }

            const blog = await getBlog(item["title"]);

            if (blog.error !== null) {
                throw new Error(blog.error);
            }

            if (!Array.isArray(blog.data) || blog.data.length === 0) {
                throw new Error(`No blog found for title "${item["title"]}".`);
            }

            const blogData = blog.data[0] as Blog;

            metadataList.push(blogData.data.metadata);
        }

        res.json({
            error: false,
            message: "Success",
            data: metadataList,
        } as GetBlogMetadataApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetBlogMetadataApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetBlogMetadataApiEndpointResponse);
    }
});

export default router;
