import { Component } from "@angular/core";
import { DonationAmountInputComponent } from "../donation-amount-input/donation-amount-input.component";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-membership-sign-up-form",
    imports: [DonationAmountInputComponent, RouterLink],
    templateUrl: "./membership-sign-up-form.component.html",
    styleUrl: "./membership-sign-up-form.component.scss",
})
export class MembershipSignUpFormComponent {
    signUp(): void {
        // Implement the sign-up logic here
        console.log("Sign-up button clicked");
    }
}
