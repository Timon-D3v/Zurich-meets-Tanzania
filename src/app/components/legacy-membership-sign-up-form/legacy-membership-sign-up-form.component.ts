import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { AuthService } from "../../services/auth.service";
import { MembershipService } from "../../services/membership.service";
import { NotificationService } from "../../services/notification.service";
import { DonationAmountInputComponent } from "../donation-amount-input/donation-amount-input.component";
import { ApiEndpointResponse } from "../../..";

@Component({
    selector: "app-legacy-membership-sign-up-form",
    imports: [DonationAmountInputComponent],
    templateUrl: "./legacy-membership-sign-up-form.component.html",
    styleUrl: "./legacy-membership-sign-up-form.component.scss",
})
export class LegacyMembershipSignUpFormComponent {
    buttonText = signal<string>("Mitglied werden");
    buttonDisabled = signal<boolean>(false);

    private router = inject(Router);

    private authService = inject(AuthService);
    private membershipService = inject(MembershipService);
    private notificationService = inject(NotificationService);

    signUp(): void {
        this.buttonText.set("Laden...");
        this.buttonDisabled.set(true);

        const user = this.authService.user();

        if (!this.authService.isLoggedIn() || user === null) {
            this.notificationService.info("Nicht eingeloggt", "Um Mitglied zu werden brauchst du einen Account. Bitte logge dich ein oder registriere dich.");

            this.router.navigate(["/login"], { queryParams: { redirectUrl: "membership" } });

            return;
        }

        if (this.authService.user()?.type === "member") {
            this.notificationService.info("Bereits Mitglied", "Du bist bereits ein Mitglied.");

            this.router.navigate(["/account"]);

            return;
        } else if (this.authService.user()?.type === "admin") {
            this.notificationService.info("Admin-Account", `Du bist als Admin eingeloggt. Bitte melde dich bei ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} (${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email}).`);

            this.buttonDisabled.set(false);
            this.buttonText.set("Mitglied werden");

            return;
        }

        const request = this.membershipService.submitLegacyMembershipForm();

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Wir konnten deine Daten nicht speichern: " + response.message);

                    this.buttonDisabled.set(false);
                    this.buttonText.set("Mitglied werden");

                    return;
                }

                this.notificationService.success("Erfolg:", "Vielen Dank für deine Unterstützung! Wir werden deine Überweisung prüfen und dich dann als Mitglied aufnehmen.");

                this.router.navigate(["/"]);
            },
            error: (error: any) => {
                console.error(error);

                this.buttonDisabled.set(false);
                this.buttonText.set("Mitglied werden");

                this.notificationService.error("Netzwerkfehler:", "Beim Absenden des Formulars ist ein Fehler aufgetreten: " + error.message);
            },
        });
    }
}
