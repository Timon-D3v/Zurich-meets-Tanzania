import { Router } from "express";
import { CONFIG } from "../config";

import apiRouter from "./api.router";
import redirectsRouter from "./redirects.api.router";
import { autoLogin } from "../middleware/autologin.middleware";

// Router Serves under /
const router = Router();

/**
 * Automatically log in a user in development mode if the AUTO_LOGIN environment variable is set to "true".
 * This is useful for testing and development purposes, allowing developers to bypass the login process.
 */
if (CONFIG.ENV === "dev" && process.env["AUTO_LOGIN"] === "true") {
    console.info("Auto-login enabled!");
    router.use(autoLogin);
}

router.use("/api", apiRouter);
router.use("/redirects", redirectsRouter);

export default router;
