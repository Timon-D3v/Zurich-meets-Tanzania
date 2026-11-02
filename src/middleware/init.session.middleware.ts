import type { Request, Response, NextFunction } from "express";

/**
 * <Function>initSession</Function>
 *
 * Initializes the user session object by ensuring it has defined values for `isLoggedIn` and `user`.
 * This middleware should be run early in the middleware stack to prevent uninitialized access errors.
 * If `session.isLoggedIn` is undefined or missing, sets it to `false` as the default state.
 * If `session.user` is undefined or missing, sets it to `null` as the default value (no authenticated user).
 * Always passes control to the next middleware/handler after ensuring session properties exist.
 *
 * @param {Request} req - The Express request object containing the express-session session data.
 * @param {Response} res - The Express response object (not used, included for Express convention).
 * @param {NextFunction} next - The middleware function to pass control to after session initialization.
 * @returns {void} Does not return a value; always calls `next()` after ensuring session properties are initialized. Throws no errors.
 */
export function initSession(req: Request, res: Response, next: NextFunction): void {
    if (req.session.isLoggedIn === undefined || typeof req.session.isLoggedIn === "undefined") {
        req.session.isLoggedIn = false;
    }

    if (req.session.user === undefined || typeof req.session.user === "undefined") {
        req.session.user = null;
    }

    next();
}
