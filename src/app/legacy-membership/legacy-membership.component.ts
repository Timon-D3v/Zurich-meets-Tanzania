import { Component, inject, PLATFORM_ID } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { LegacyMembershipSignUpFormComponent } from "../components/legacy-membership-sign-up-form/legacy-membership-sign-up-form.component";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-legacy-membership",
    imports: [HeroComponent, LegacyMembershipSignUpFormComponent],
    templateUrl: "./legacy-membership.component.html",
    styleUrl: "./legacy-membership.component.scss",
})
export class LegacyMembershipComponent {
    elementToScrollTo = "#scrollToLegacyMembership";

    platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.scroll();
    }

    /**
     * <Function>scroll</Function>
     * 
     * Scrolls the viewport to smoothly scroll to the legacy membership form section element on page load and other scroll triggers.
     * Uses JavaScript's DOM API via document.querySelector() to find target element by its ID attribute (elementToScrollTo).
     * Only runs in browser context (checks isPlatformBrowser) to avoid server-side scroll attempts on Node.js environments; returns early on invalid/undefined platformId.
     * Calls Element.scrollIntoView() with behavior "smooth" and block alignment "start" for smooth user experience when scrolling to legacy membership signup form section.
     * If target element exists in DOM (by its ID selector), performs the scroll action; if element is missing, silently returns without errors.
     * Used during ngOnInit initialization for auto-scrolling visitors to legacy membership section, also applicable when navigating to this component from any page.
     * 
     * @returns {void} Does not return a value and performs no side effects outside of the browser DOM context; throws no errors even on invalid selectors or non-browser environments.
     */
    scroll(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const element = document.querySelector(this.elementToScrollTo);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }
}
