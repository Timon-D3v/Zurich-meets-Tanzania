import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { HeaderNavAnchorWidthArray } from "../..";

@Injectable({
    providedIn: "root",
})
export class HeaderService {
    widths = signal<HeaderNavAnchorWidthArray>([0, 0, 0, 0, 0]);

    readonly ELEMENTS_LENGTH = 5;

    private platformId = inject(PLATFORM_ID);

    update(): void {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("This method can only be called in browser context.");
        }

        const elements = document.querySelectorAll<HTMLElement>("app-header-link");
        const nav = document.querySelector<HTMLElement>("nav");
        const logoComponent = document.querySelector<HTMLElement>("app-logo");

        if (elements.length !== this.ELEMENTS_LENGTH) {
            throw new Error(`Incorrect elements length. Expected: ${this.ELEMENTS_LENGTH}, Actual value: ${elements.length}`);
        }

        if (nav === null || logoComponent === null) {
            throw new Error("Not all elements found.");
        }

        for (let i = 0; i < this.ELEMENTS_LENGTH; i++) {
            nav.style.setProperty("--floating-navigation-activator-width-" + i.toString(), elements[i].clientWidth.toString() + "px");
        }

        nav.style.setProperty("--header-main-logo-width", logoComponent.clientWidth.toString() + "px");
    }
}
