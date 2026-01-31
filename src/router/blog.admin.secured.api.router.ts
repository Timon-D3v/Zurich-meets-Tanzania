import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { Blog, DatabaseApiEndpointResponse, GetAllBlogsApiEndpointResponse } from "..";
import { getAllBlogs, getAllBlogTitles } from "../shared/blog.database";

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

export default router;
