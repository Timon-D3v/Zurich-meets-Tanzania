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
