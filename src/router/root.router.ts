import { Router } from "express";

import apiRouter from "./api.router";

// Router Serves under /
const router = Router();

router.use("/api", apiRouter);

export default router;
