import { Router } from "express";

import blogRouter from "./blog.router";

// Router Serves under /api and /post
const router = Router();

router.use("/blog", blogRouter);

export default router;
