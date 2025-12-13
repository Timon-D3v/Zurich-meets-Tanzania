import { Router } from "express";

import authRouter from "./auth.api.router";
import blogRouter from "./blog.api.router";
import themeRouter from "./theme.api.router";
import galleryRouter from "./gallery.api.router";
import newsletterRouter from "./newsletter.router";

// Router Serves under /api
const router = Router();

router.use("/auth", authRouter);
router.use("/blog", blogRouter);
router.use("/theme", themeRouter);
router.use("/gallery", galleryRouter);
router.use("/newsletter", newsletterRouter);

export default router;
