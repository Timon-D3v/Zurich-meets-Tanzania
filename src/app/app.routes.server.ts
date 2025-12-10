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
        path: "**",
        renderMode: RenderMode.Prerender,
    },
];
