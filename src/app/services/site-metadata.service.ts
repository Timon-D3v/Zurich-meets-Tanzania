import { inject, Injectable } from "@angular/core";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { PageDescription } from "../..";
import { Meta, Title } from "@angular/platform-browser";

@Injectable({
    providedIn: "root",
})
export class SiteMetadataService {
    private meta = inject(Meta);
    private titleService = inject(Title);

    getMetadataForRoute(route: string): PageDescription {
        try {
            if (typeof PUBLIC_CONFIG.ROUTES.TITLES[route as `/${string}`] === "undefined") {
                throw new Error("No title found for route.");
            }

            return PUBLIC_CONFIG.ROUTES.TITLES[route as `/${string}`];
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error getting metadata for route:", error.message);
            }

            return {
                title: PUBLIC_CONFIG.NAME,
                description: "Keine Beschreibung für diese Seite gefunden...",
                lastUpdated: `(Unbekannt): ${Date()}`,
            };
        }
    }

    updateMetadataForRoute(route: string): void {
        const { title, description, lastUpdated } = this.getMetadataForRoute(route as `/${string}`);

        this.titleService.setTitle(title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX);
        this.meta.updateTag({ content: title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX }, "property='og:title'");

        this.meta.updateTag({ content: description }, "name='description'");
        this.meta.updateTag({ content: description }, "property='og:description'");

        this.meta.updateTag({ content: PUBLIC_CONFIG.ORIGIN + route }, "property='og:url'");

        this.meta.updateTag({ content: lastUpdated }, "name='last-modified'");

        console.log("Title set to:", title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX);
        console.log("Description set to:", description);
    }

    updateRobotsSettingsForRoute(route: string): void {
        if (PUBLIC_CONFIG.ROUTES.TYPES.ADMIN.includes(route)) {
            this.meta.updateTag({ content: "noindex,nofollow,noarchive" }, "name='robots'");
            this.meta.updateTag({ content: "noindex,nofollow,noarchive" }, "name='googlebot'");
        } else if (PUBLIC_CONFIG.ROUTES.TYPES.SECURED.includes(route) || PUBLIC_CONFIG.ROUTES.TYPES.AUTH.includes(route)) {
            this.meta.updateTag({ content: "index,follow,noarchive" }, "name='robots'");
            this.meta.updateTag({ content: "index,follow,noarchive" }, "name='googlebot'");
        } else {
            this.meta.updateTag({ content: "index,follow,archive" }, "name='robots'");
            this.meta.updateTag({ content: "index,follow,archive" }, "name='googlebot'");
        }
    }

    setDefaultMetadata(): void {
        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["CHAIRMAN"].name }, "name='chairman'");
        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["CHAIRMAN"].email }, "name='chairman-contact'");

        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["SECRETARY"].name }, "name='secretary'");
        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["SECRETARY"].email }, "name='secretary-contact'");

        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name }, "name='developer'");
        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email }, "name='developer-contact'");
        this.meta.updateTag({ content: (PUBLIC_CONFIG.PERSONAS["DEVELOPER"].website as string) + "/contact" }, "name='developer-contact-page'");
        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["DEVELOPER"].website as string }, "name='developer-website'");
        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["DEVELOPER"].linkedIn as string }, "name='developer-linkedIn'");
        this.meta.updateTag({ content: PUBLIC_CONFIG.PERSONAS["DEVELOPER"].github as string }, "name='developer-github'");

        this.meta.updateTag({ content: PUBLIC_CONFIG.ORIGIN + "/contact" }, "name='contact-page'");

        this.meta.updateTag({ content: PUBLIC_CONFIG.THEME_COLOR }, "name='theme-color'");
    }
}
