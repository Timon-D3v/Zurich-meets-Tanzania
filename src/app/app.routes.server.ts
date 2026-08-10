import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
    {
        path: "gallery/:name",
        renderMode: RenderMode.Server,
    },
    {
        path: "blog/:name",
        renderMode: RenderMode.Server,
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
        path: "**",
        renderMode: RenderMode.Prerender,
    },
];
