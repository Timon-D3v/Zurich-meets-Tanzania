import { Router } from "express";

import themeRouter from "./theme.secured.api.router";
import accountRouter from "./account.secured.api.router";
import paymentsRouter from "./payments.secured.api.router";
import membershipRouter from "./membership.secured.api.router";

import adminRouter from "./admin.secured.api.router";

import { isAdmin } from "../middleware/auth.middleware";

// Router Serves under /api/secured
// To access apis under this router, authentication is required
const router = Router();

router.use("/theme", themeRouter);
router.use("/account", accountRouter);
router.use("/payments", paymentsRouter);
router.use("/membership", membershipRouter);

// Secured Routes for Admins
router.use("/admin", isAdmin, adminRouter);

export default router;
