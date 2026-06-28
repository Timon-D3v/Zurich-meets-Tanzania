import { Component } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { MembershipSignUpFormComponent } from "../components/membership-sign-up-form/membership-sign-up-form.component";

@Component({
    selector: "app-membership",
    imports: [HeroComponent, MembershipSignUpFormComponent],
    templateUrl: "./membership.component.html",
    styleUrl: "./membership.component.scss",
})
export class MembershipComponent {}
