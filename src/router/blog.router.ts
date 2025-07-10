import { Router } from "express";
import { getLastXBlogTitles } from "../shared/blog.database";

// Router Serves under /api/blog and /post/blog
const router = Router();

router.post("/getLinks/:count", async (req, res): Promise<void> => {
    const x = req.params?.count;

    if (typeof x !== "string" || typeof Number(x) !== "number") {
        res.status(501).json({
            data: null,
            error: "Please enter valid data."
        });
    }

    const response = await getLastXBlogTitles(Number(x));

    res.json(response);
});

export default router;
