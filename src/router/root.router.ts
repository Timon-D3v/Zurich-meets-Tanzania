import { Router } from "express";
import rateLimit from "express-rate-limit";

import apiRouter from "./api.router";

// Router Serves under /
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

router.use("/api", apiRouter);

export default router;
