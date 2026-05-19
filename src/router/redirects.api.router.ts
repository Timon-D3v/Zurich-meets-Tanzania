import { Request, Response, Router } from "express";
import { CONFIG } from "../config";

// Router Serves under /redirects
const router = Router();

router.get("/heroImage", (_req: Request, res: Response): void => {
    res.redirect(`${CONFIG.DELIVAPI_URL}/cdn/${CONFIG.ENV === "dev" ? "dev" : "zmt"}/heroImage`);
});

export default router;
