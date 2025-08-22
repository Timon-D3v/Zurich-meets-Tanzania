import { Router } from "express";

import authRouter from "./auth.api.router";
import blogRouter from "./blog.api.router";
import galleryRouter from "./gallery.api.router";

// Router Serves under /api
const router = Router();

router.use("/auth", authRouter);
router.use("/blog", blogRouter);
router.use("/gallery", galleryRouter);

export default router;
