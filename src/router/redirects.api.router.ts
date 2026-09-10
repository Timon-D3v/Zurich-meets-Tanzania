import { Request, Response, Router } from "express";
import { CONFIG } from "../config";

// Router Serves under /redirects
const router = Router();

router.get("/heroImage", (_req: Request, res: Response): void => {
    res.redirect(`${CONFIG.DELIVAPI_URL}/cdn/${CONFIG.DELIVAPI_USER}/heroImage`);
});

export default router;
