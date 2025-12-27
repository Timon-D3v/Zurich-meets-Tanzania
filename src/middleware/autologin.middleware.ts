import type { Request, Response, NextFunction } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { CONFIG } from "../config";

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
            address: "Test 1, DM-0000, Lego City",
            type: "admin",
            picture: "https://api.timondev.com/cdn/dev/7a122",
        };

        req.session.resetMaxAge();
    }

    next();
}
