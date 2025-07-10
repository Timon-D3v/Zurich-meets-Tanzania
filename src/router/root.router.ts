import { Router } from "express";

import apiRouter from "./api.router";

// Router Serves under /
const router = Router();

router.use("/api", apiRouter);
router.use("/post", apiRouter); // This line is redundant as it uses the same apiRouter, but kept for backward compatibility

export default router;
