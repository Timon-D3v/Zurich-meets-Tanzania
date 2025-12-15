import { Router } from "express";
import rateLimit from "express-rate-limit";

import authRouter from "./auth.api.router";
import blogRouter from "./blog.api.router";
import themeRouter from "./theme.api.router";
import galleryRouter from "./gallery.api.router";
import newsletterRouter from "./newsletter.router";

// Router Serves under /api
const router = Router();

/**
 * Allow an average max of 5 requests per second per minute.
 * This has the same effect as a rate limit of 5 requests per second but is
 * a little more flexible if requests stack while the site loads.
 */
router.use(
    rateLimit({
        limit: 5 * 60,
        windowMs: 1000 * 60,
    }),
);

router.use("/auth", authRouter);
router.use("/blog", blogRouter);
router.use("/theme", themeRouter);
router.use("/gallery", galleryRouter);
router.use("/newsletter", newsletterRouter);

export default router;
