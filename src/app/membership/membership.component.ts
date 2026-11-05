import { Component, inject, PLATFORM_ID } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { MembershipSignUpFormComponent } from "../components/membership-sign-up-form/membership-sign-up-form.component";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-membership",
    imports: [HeroComponent, MembershipSignUpFormComponent],
    templateUrl: "./membership.component.html",
    styleUrl: "./membership.component.scss",
})
export class MembershipComponent {
    elementToScrollTo = "#scrollToMembership";

    platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.scroll();
    }

    /**
     * <Function>scroll</Function>
     * 
     * Scrolls the viewport to smoothly scroll to the membership form section element on page load during initialization and other scroll triggers.
     * Uses JavaScript's DOM API via document.querySelector() to find target element by its ID attribute (elementToScrollTo).
     * Only runs in browser context (checks isPlatformBrowser) to avoid server-side scroll attempts on Node.js environments; returns early with no action on non-browser platform.
     * Calls Element.scrollIntoView() with behavior "smooth" and block alignment "center" for optimal vertical positioning when scrolling to membership signup form section.
     * If target element exists in DOM (by its ID selector "#scrollToMembership"), performs the scroll action; if element missing, silently returns without errors after checking platform.
     * Used during ngOnInit auto-scroll on page load and applicable when navigating to this component from any route link or navigation action.
     * 
     * @returns {void} Does not return a value and performs no side effects outside of browser DOM operations; throws no errors even on invalid selectors or non-browser environments.
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
