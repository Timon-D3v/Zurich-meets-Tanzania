import { Component } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { LegacyMembershipSignUpFormComponent } from "../components/legacy-membership-sign-up-form/legacy-membership-sign-up-form.component";

@Component({
    selector: "app-legacy-membership",
    imports: [HeroComponent, LegacyMembershipSignUpFormComponent],
    templateUrl: "./legacy-membership.component.html",
    styleUrl: "./legacy-membership.component.scss",
})
export class LegacyMembershipComponent {}
