import type { Request, Response, NextFunction } from "express";

export function initSession(req: Request, res: Response, next: NextFunction): void {
    if (req.session.isLoggedIn === undefined || typeof req.session.isLoggedIn === "undefined") {
        req.session.isLoggedIn = false;
    }

    if (req.session.user === undefined || typeof req.session.user === "undefined") {
        req.session.user = null;
    }

    next();
}
