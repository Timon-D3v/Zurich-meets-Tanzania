import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class StyleNamespaceService {
    private platformId = inject(PLATFORM_ID);

    setAuthStyleNamespace(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const footer = document.querySelector<HTMLElement>(":root");

        if (footer === null) {
            throw new Error("Root not found to add style namespace.");
        }

        footer.dataset["styleNamespace"] = "auth";
    }

    setContactStyleNamespace(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const footer = document.querySelector<HTMLElement>(":root");

        if (footer === null) {
            throw new Error("Root not found to add style namespace.");
        }

        footer.dataset["styleNamespace"] = "contact";
    }

    setDefaultStyleNamespace(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const footer = document.querySelector<HTMLElement>(":root");

        if (footer === null) {
            throw new Error("Root not found to add style namespace.");
        }

        footer.dataset["styleNamespace"] = "default";
    }
}
