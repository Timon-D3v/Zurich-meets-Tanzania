import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { GetLastXNewsIdsApiEndpointResponse, GetNewsApiEndpointResponse, News } from "..";
import { getLastXNewsIds, getLatestNews, getNews } from "../shared/news.database";

// Router Serves under /api/news
const router = Router();

router.get("/getLatestNews", async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getLatestNews();

        if (response.error !== null) {
            throw new Error(response.error);
        }

        if (response.data.length === 0) {
            throw new Error(`Es wurden keine News gefunden.`);
        }

        const newsData = response.data[0] as News;

        res.json({
            error: false,
            message: "Success",
            data: newsData,
        } as GetNewsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetNewsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetNewsApiEndpointResponse);
    }
});

router.get("/getNews/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params?.["id"];

        if (typeof id !== "string" || id.trim() === "" || typeof Number(id) !== "number" || isNaN(Number(id)) || Number(id) <= 0) {
            throw new Error("Please use a valid news ID.");
        }

        const response = await getNews(Number(id));

        if (response.error !== null) {
            throw new Error(response.error);
        }

        if (response.data.length === 0) {
            throw new Error(`Keine News mit der ID "${id}" gefunden.`);
        }

        const newsData = response.data[0] as News;

        res.json({
            error: false,
            message: "Success",
            data: newsData,
        } as GetNewsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetNewsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetNewsApiEndpointResponse);
    }
});

router.get("/getLastXNews/:num", async (req: Request, res: Response): Promise<void> => {
    try {
        const num = req.params?.["num"];

        if (typeof num !== "string" || num.trim() === "" || typeof Number(num) !== "number" || isNaN(Number(num)) || Number(num) <= 0) {
            throw new Error("Please use a valid number of news items to retrieve.");
        }

        const response = await getLastXNewsIds(Number(num));

        if (response.error !== null) {
            throw new Error(response.error);
        }

        if (response.data.length === 0) {
            throw new Error(`Keine News mit der Anzahl "${num}" gefunden.`);
        }

        const newsData = response.data.map((news: { id: number }) => news.id);

        res.json({
            error: false,
            message: "Success",
            data: newsData,
        } as GetLastXNewsIdsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetLastXNewsIdsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetLastXNewsIdsApiEndpointResponse);
    }
});

export default router;
