import { Component, signal, inject } from "@angular/core";
import { DonationAmountInputComponent } from "../donation-amount-input/donation-amount-input.component";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../services/notification.service";
import { MembershipService } from "../../services/membership.service";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { CreateCheckoutSessionApiEndpointResponse } from "../../..";

@Component({
    selector: "app-membership-sign-up-form",
    imports: [DonationAmountInputComponent, RouterLink],
    templateUrl: "./membership-sign-up-form.component.html",
    styleUrl: "./membership-sign-up-form.component.scss",
})
export class MembershipSignUpFormComponent {
    buttonText = signal<string>("Mitglied werden");
    buttonDisabled = signal<boolean>(false);

    private router = inject(Router);

    private authService = inject(AuthService);
    private membershipService = inject(MembershipService);
    private notificationService = inject(NotificationService);

    signUp(): void {
        this.buttonDisabled.set(true);
        this.buttonText.set("Laden...");

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

        const request = this.membershipService.createCheckoutSession();

        request.subscribe({
            next: (response: CreateCheckoutSessionApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler:", "Wir konnten dich nicht zur Zahlung weiterleiten: " + response.message);

                    this.buttonDisabled.set(false);
                    this.buttonText.set("Mitglied werden");

                    return;
                }

                window.location.href = response.data.url;
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
