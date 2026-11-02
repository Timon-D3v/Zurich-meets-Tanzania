import type { Request, Response, NextFunction } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { CONFIG } from "../config";

/**
 * <Function>autoLogin</Function>
 *
 * Automatically logs in a developer/admin user when running in development mode with AUTO_LOGIN enabled.
 * This function creates a session for a test admin persona to facilitate local development and testing.
 * Only executes the auto-login setup if both CONFIG.ENV is "dev" and the environment variable "AUTO_LOGIN" is set to "true".
 * Sets up a complete user object including credentials (hashed password), profile information, and admin-type privileges.
 * Resets the session expiration timer by calling resetMaxAge() before passing control to the next middleware.
 *
 * @param {Request} req - The Express request object whose session will be initialized if auto-login is enabled.
 * @param {Response} res - The Express response object (not used in this middleware, but included for Express convention).
 * @param {NextFunction} next - The middleware function to pass control to after session setup.
 * @returns {void} Does not return a value; always calls `next()` regardless of auto-login condition. Throws no errors.
 */
export function autoLogin(req: Request, res: Response, next: NextFunction): void {
    if (CONFIG.ENV === "dev" && process.env["AUTO_LOGIN"] === "true") {
        req.session.isLoggedIn = true;
        req.session.user = {
            id: 999,
            email: PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email,
            password: "$2b$10$IUBN.qEf/pRq30OhpbuTcuO1gbI3n6bXs/aoLLvpC45fAmtKZN/VG",
            firstName: "Admin",
            lastName: "Test",
            phone: "Keine Nummer",
            address: "Test 1, DM-0000 Lego City",
            type: "admin",
            picture: "/svg/personal.svg",
        };

        req.session.resetMaxAge();
    }

    next();
}
