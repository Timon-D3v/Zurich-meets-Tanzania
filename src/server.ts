import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from "@angular/ssr/node";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import { join } from "node:path";
import rootRouter from "./router/root.router";
import { CONFIG } from "./config";
import { initSession } from "./middleware/init.session.middleware";
import { PUBLIC_CONFIG } from "./publicConfig";
import { isAdmin, isLoggedIn } from "./middleware/auth.middleware";

const browserDistFolder = join(import.meta.dirname, "../browser");

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Set up express configuration
 */
app.use(
    express.urlencoded({
        extended: true,
        limit: "10000mb",
    }),
);
app.use((req: Request, res: Response, next: NextFunction) => {
    if (/\/api\/stripe\/webhook/.test(req.originalUrl)) {
        next();
        return;
    }

    express.json({
        limit: "10000mb",
    })(req, res, next);
});

/**
 * Set up session management.
 * This uses express-session to manage user sessions.
 */
app.use(
    session({
        secret: CONFIG.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 432000000,
        },
    }),
);

/**
 * Add default session options.
 */
app.use(initSession);

/**
 * Enable CORS for all routes.
 * This allows cross-origin requests, which is useful for APIs and frontend-backend communication.
 */
app.use(cors());

/**
 * Root router serves the entire backend.
 */
app.use(rootRouter);

/**
 * Serve static files from /browser
 */
app.use(
    express.static(browserDistFolder, {
        maxAge: "1y",
        index: false,
        redirect: false,
    }),
);

/**
 * Secure routes that not everyone should have access
 */
for (const route of PUBLIC_CONFIG.ROUTES.TYPES.SECURED) {
    app.use(route, isLoggedIn);
}
for (const route of PUBLIC_CONFIG.ROUTES.TYPES.ADMIN) {
    app.use(route, isAdmin);
}

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    angularApp
        .handle(req)
        .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
        .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
    const port = process.env["PORT"] || 4000;
    app.listen(port, (error) => {
        if (error) {
            throw error;
        }

        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
