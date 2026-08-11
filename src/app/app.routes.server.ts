import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
    {
        path: "contact",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "donate",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "imprint",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "legacy-membership",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "membership",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "newsletter/cancel",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "newsletter/confirm",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "payment-success",
        renderMode: RenderMode.Client,
    },
    {
        path: "payment-cancelled",
        renderMode: RenderMode.Client,
    },
    {
        path: "privacy",
        renderMode: RenderMode.Prerender,
    },

    // Secured routes

    // Only for unauthenticated users
    {
        path: "login",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "signup",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "signup-confirm",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "password-recovery",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "password-recovery-confirm",
        renderMode: RenderMode.Prerender,
    },

    // Admin routes

    // All not specified routes
    {
        path: "**",
        renderMode: RenderMode.Server,
    },
];
