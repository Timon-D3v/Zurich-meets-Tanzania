import { Router } from "express";

import adminTeamRouter from "./team.admin.secured.api.router";
import adminBlogRouter from "./blog.admin.secured.api.router";
import adminSubpagesRouter from "./subpages.admin.secured.api.router";
import adminManagementRouter from "./management.admin.secured.api.router";

// Router Serves under /api/secured/admin
// To access apis under this router, authentication with admin privilege is required
const router = Router();

router.use("/team", adminTeamRouter);
router.use("/blog", adminBlogRouter);
router.use("/subpages", adminSubpagesRouter);
router.use("/management", adminManagementRouter);

export default router;
