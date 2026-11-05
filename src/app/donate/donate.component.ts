import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { DonationFormComponent } from "../components/donation-form/donation-form.component";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-donate",
    imports: [HeroComponent, DonationFormComponent],
    templateUrl: "./donate.component.html",
    styleUrl: "./donate.component.scss",
})
export class DonateComponent implements OnInit {
    elementToScrollTo = "#scrollToDonate";

    platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.scroll();
    }

    /**
     * <Function>scroll</Function>
     * 
     * Scrolls the viewport to smooth-scroll to the donation form section element on page load.
     * Uses JavaScript's DOM API via document.querySelector() to find the target element by its ID attribute (elementToScrollTo).
     * Only runs in browser context (checks isPlatformBrowser) to avoid server-side scroll attempts.
     * When the target element with ID "scrollToDonate" exists, calls scrollIntoView({behavior: "smooth", block: "center"}) for smooth user experience.
     * If the element doesn't exist or running on non-browser platform, silently returns without performing any action; no errors thrown.
     * 
     * @returns {void} Does not return a value and performs no side effects outside of the browser DOM context. Throws no errors.
     */
    scroll(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const element = document.querySelector(this.elementToScrollTo);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }
}
