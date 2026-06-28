import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { DonationAmountInputComponent } from "../donation-amount-input/donation-amount-input.component";

@Component({
    selector: "app-legacy-membership-sign-up-form",
    imports: [DonationAmountInputComponent],
    templateUrl: "./legacy-membership-sign-up-form.component.html",
    styleUrl: "./legacy-membership-sign-up-form.component.scss",
})
export class LegacyMembershipSignUpFormComponent {
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    signUp(): void {
        // Implement the sign-up logic here
        console.log("Sign-up button clicked");

        this.notificationService.success("Erfolgreich", "Vielen Dank für deine Unterstützung! Wir werden deine Überweisung prüfen und dich dann als Mitglied aufnehmen."    );
        
        this.router.navigate(["/"]);
    }
}
