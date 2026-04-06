import { Router } from "express";
import rateLimit from "express-rate-limit";

import envRouter from "./env.api.router";
import authRouter from "./auth.api.router";
import newsRouter from "./news.api.router";
import blogRouter from "./blog.api.router";
import teamRouter from "./team.api.router";
import contactRouter from "./contact.api.router";
import galleryRouter from "./gallery.api.router";
import calendarRouter from "./calendar.api.router";
import subpagesRouter from "./subpages.api.router";
import newsletterRouter from "./newsletter.api.router";

import securedRouter from "./secured.api.router";

import { isLoggedIn } from "../middleware/auth.middleware";

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

router.use("/env", envRouter);
router.use("/auth", authRouter);
router.use("/news", newsRouter);
router.use("/blog", blogRouter);
router.use("/team", teamRouter);
router.use("/contact", contactRouter);
router.use("/gallery", galleryRouter);
router.use("/calendar", calendarRouter);
router.use("/subpages", subpagesRouter);
router.use("/newsletter", newsletterRouter);

// Secured Routes
router.use("/secured", isLoggedIn, securedRouter);

export default router;
