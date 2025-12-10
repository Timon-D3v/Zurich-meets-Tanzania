import { Component, computed, inject, PLATFORM_ID, Signal, signal } from "@angular/core";
import { AuthInputComponent } from "../components/auth-input/auth-input.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponseWithRedirect } from "../..";

@Component({
    selector: "app-password-recovery-confirm",
    imports: [AuthInputComponent, RouterLink],
    templateUrl: "./password-recovery-confirm.component.html",
    styleUrl: "./password-recovery-confirm.component.scss",
})
export class PasswordRecoveryConfirmComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Bestätigen");

    email: Signal<string> = computed<string>((): string => this.route.snapshot.queryParams?.["email"] ?? "");

    codeInput = signal<string>("");

    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private platformId = inject(PLATFORM_ID);

    updateCodeInput(input: null | string | number | object) {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.codeInput.set(input);
    }

    recover(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        event.preventDefault();

        const code = this.codeInput().trim().toLowerCase();

        if (code === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib den Code ein, den du per E-Mail erhalten hast.");
            return;
        }

        if (!/([0-9a-f]{20})/.test(code)) {
            this.notificationService.error("Eingabefehler", "Bitte gib einen gültigen Code ein.");
            return;
        }

        const email = this.email().trim();

        if (email === "") {
            this.notificationService.error("Keine E-Mail gefunden", "Etwas hat leider nicht geklappt. Bitte starte die Kontowiederherstellung noch einemal.");
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Ungültige E-Mail erkannt", "Etwas ist leider schief gelaufen. Bitte starte die Kontowiederherstellung noch einemal.");
            return;
        }

        console.log(email)

        this.disabledButton.set(true);
        this.submitButtonText.set("Bestätigen...");

        const response = this.authService.confirmPasswordRecovery(email, code);

        response.subscribe(async (response: ApiEndpointResponseWithRedirect): Promise<void> => {
            if (response.error) {
                this.notificationService.error("Fehler", response.message);
                this.disabledButton.set(false);
                this.submitButtonText.set("Bestätigungscode senden");

                if (response?.data?.redirectUrl && typeof response.data.redirectUrl === "string") {
                    this.router.navigate([response.data.redirectUrl], {
                        queryParams: response.data?.queryParams
                    });
                }

                return;
            }

            this.notificationService.success("Erfolg", response.message);
            this.authService.getCurrentUserDetails();

            this.submitButtonText.set("Bestätigt");

            this.router.navigate(["/login"]);
        });
    }
}
