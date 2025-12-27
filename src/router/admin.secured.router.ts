import { Router } from "express";

import adminManagementRouter from "./management.admin.secured.router";

// Router Serves under /api/secured/admin
// To access apis under this router, authentication with admin privilege is required
const router = Router();

router.use("/management", adminManagementRouter);

export default router;
