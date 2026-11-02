import type { Request, Response, NextFunction } from "express";

/**
 * <Function>isLoggedIn</Function>
 *
 * Verifies whether the current user session is active and authenticated.
 * If the user is logged in, passes control to the next middleware/handler.
 * For GET requests to non-API routes, redirects to the login page with the original URL as a query parameter.
 * For other cases (non-GET or API routes), returns a JSON error response indicating unauthenticated access.
 *
 * @param {Request} req - The Express request object containing session data including `isLoggedIn` and `user`.
 * @param {Response} res - The Express response object for redirecting or sending JSON responses.
 * @param {NextFunction} next - The middleware function to pass control to if authentication succeeds.
 * @returns {void} Does not return a value; either calls `next()`, redirects the user, or sends an error response. Throws no errors.
 */
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

/**
 * <Function>isAdmin</Function>
 *
 * Verifies that the current user is both authenticated and has administrator privileges.
 * If the user is an admin, passes control to the next middleware/handler.
 * For GET requests to non-API routes, redirects to the login page with the original URL as a query parameter.
 * For other cases (non-GET or API routes), returns a JSON error response indicating insufficient permissions.
 *
 * @param {Request} req - The Express request object containing session data including `isLoggedIn`, `user`, and `user.type`.
 * @param {Response} res - The Express response object for redirecting or sending JSON responses.
 * @param {NextFunction} next - The middleware function to pass control to if admin privileges are confirmed.
 * @returns {void} Does not return a value; either calls `next()`, redirects the user, or sends an error response. Throws no errors.
 */
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
