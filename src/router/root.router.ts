import { Router } from "express";

import apiRouter from "./api.router";
import { autoLogin } from "../middleware/autologin.middleware";

// Router Serves under /
const router = Router();

router.use(autoLogin);

router.use("/api", apiRouter);

export default router;
