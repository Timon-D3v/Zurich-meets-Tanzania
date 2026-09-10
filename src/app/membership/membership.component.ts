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
