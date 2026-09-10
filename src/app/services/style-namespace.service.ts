import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class StyleNamespaceService {
    private platformId = inject(PLATFORM_ID);

    private getRoot(): HTMLElement {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot get the root on server side context.");
        }

        const root = document.querySelector<HTMLElement>(":root");

        if (root === null) {
            throw new Error("Root not found to add style namespace.");
        }

        return root;
    }

    setHomeStyleNamespace(): void {
        const root = this.getRoot();

        root.dataset["styleNamespace"] = "home";
    }

    setAuthStyleNamespace(): void {
        const root = this.getRoot();

        root.dataset["styleNamespace"] = "auth";
    }

    setContactStyleNamespace(): void {
        const root = this.getRoot();

        root.dataset["styleNamespace"] = "contact";
    }

    setDefaultStyleNamespace(): void {
        const root = this.getRoot();

        root.dataset["styleNamespace"] = "default";
    }
}
