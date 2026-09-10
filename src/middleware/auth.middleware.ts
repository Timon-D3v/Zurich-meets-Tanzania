import type { Request, Response, NextFunction } from "express";

export function isLoggedIn(req: Request, res: Response, next: NextFunction): void {
    if (req.session.isLoggedIn && req.session.user !== null) {
        next();
        return;
    }

    if (req.method === "GET" && !req.originalUrl.includes("/api")) {
        res.redirect(`/login?redirectUrl=${req.originalUrl}`);
    } else {
        res.json({
            error: true,
            message: "Du bist momentan nicht eingeloggt und kannst diese Anfrage deshalb nicht tätigen.",
            data: null,
        });
    }
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.session.isLoggedIn && req.session.user !== null && req.session.user?.type === "admin") {
        next();
        return;
    }

    if (req.method === "GET" && !req.originalUrl.includes("/api")) {
        res.redirect(`/login?redirectUrl=${req.originalUrl}`);
    } else {
        res.json({
            error: true,
            message: "Du bist kein Admin und kannst diese Anfrage deshalb nicht tätigen.",
            data: null,
        });
    }
}
