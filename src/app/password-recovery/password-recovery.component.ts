import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { AuthInputComponent } from "../components/auth-input/auth-input.component";
import { Router, RouterLink } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponseWithRedirect } from "../..";

@Component({
    selector: "app-password-recovery",
    imports: [AuthInputComponent, RouterLink],
    templateUrl: "./password-recovery.component.html",
    styleUrl: "./password-recovery.component.scss",
})
export class PasswordRecoveryComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Bestätigungscode senden");

    emailInput = signal<string>("");

    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    private platformId = inject(PLATFORM_ID);

    updateEmailInput(input: null | string | number | object) {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.emailInput.set(input);
    }

    recover(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        event.preventDefault();

        const email = this.emailInput().trim();

        if (email === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib deine E-Mail-Adresse ein.");
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler", "Bitte gib eine gültige E-Mail-Adresse ein.");
            return;
        }

        this.disabledButton.set(true);
        this.submitButtonText.set("Senden...");

        const response = this.authService.startPasswordRecovery(email);

        response.subscribe(async (response: ApiEndpointResponseWithRedirect): Promise<void> => {
            if (response.error) {
                this.notificationService.error("Fehler", response.message);
                this.disabledButton.set(false);
                this.submitButtonText.set("Bestätigungscode senden");

                if (response?.data?.redirectUrl && typeof response.data.redirectUrl === "string") {
                    this.router.navigate([response.data.redirectUrl], {
                        queryParams: response.data?.queryParams,
                    });
                }

                return;
            }

            this.notificationService.success("Erfolg", response.message);

            this.submitButtonText.set("Gesendet");

            this.router.navigate(["/password-recovery-confirm"], { queryParams: { email } });
        });
    }
}
