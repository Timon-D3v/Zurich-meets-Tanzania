import { Router } from "express";

import themeRouter from "./theme.api.router";

import adminRouter from "./admin.secured.router";

import { isAdmin } from "../middleware/auth.middleware";

// Router Serves under /api/secured
// To access apis under this router, authentication is required
const router = Router();

router.use("/theme", themeRouter);

// Secured Routes for Admins
router.use("/admin", isAdmin, adminRouter);

export default router;
