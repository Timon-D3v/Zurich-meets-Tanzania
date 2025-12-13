import { Request, Response, Router } from "express";
import { ApiEndpointResponse, GetThemeApiEndpointResponse } from "..";
import { getThemeFromUserId, setThemeForUserId } from "../shared/theme.database";

// Router Serves under /api/theme
const router = Router();

router.get("/get", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.session.isLoggedIn || req.session.user === null || !req.session.user) {
            res.json({
                error: true,
                message: "You are not logged in and therefore cannot get your stored theme.",
                data: {
                    theme: null,
                },
            } as GetThemeApiEndpointResponse);

            return;
        }

        const data = await getThemeFromUserId(req.session.user.id);

        if (data.error !== null) {
            throw new Error(data.error);
        }

        res.json({
            error: false,
            message: "Successfully retrieved theme",
            data: {
                theme: data.data?.[0].darkmode === 1 ? "dark" : "light",
            },
        } as GetThemeApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: {
                    theme: null,
                },
            } as GetThemeApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: "501: Internal Server Error",
            data: {
                theme: null,
            },
        } as GetThemeApiEndpointResponse);
    }
});

router.post("/set", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.session.isLoggedIn || req.session.user === null || !req.session.user) {
            res.json({
                error: true,
                message: "You are not logged in and therefore cannot store your theme.",
            } as ApiEndpointResponse);

            return;
        }

        const { theme } = req.body;

        if (theme !== "light" && theme !== "dark") {
            res.json({
                error: true,
                message: `Invalid theme: '${theme}' (Expected 'light' | 'dark')`,
            } as ApiEndpointResponse);

            return;
        }

        const data = await setThemeForUserId(theme === "dark", req.session.user.id);

        if (data.error !== null) {
            throw new Error(data.error);
        }

        res.json({
            error: false,
            message: "Successfully set theme",
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
            message: "501: Internal Server Error",
        } as ApiEndpointResponse);
    }
});

export default router;
