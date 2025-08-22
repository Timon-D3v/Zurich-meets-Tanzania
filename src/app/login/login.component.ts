import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { AuthInputComponent } from "../components/auth-input/auth-input.component";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponse, EmailPasswordCombo } from "../..";

@Component({
    selector: "app-login",
    imports: [AuthInputComponent, RouterLink],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Einloggen");

    emailInput = signal<string>("");
    passwordInput = signal<string>("");

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

    updatePasswordInput(input: null | string | number | object) {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.passwordInput.set(input);
    }

    login(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        event.preventDefault();

        const userInputs = this.getUserInputs();

        if (userInputs.email === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib deine E-Mail-Adresse ein.");
            return;
        }

        if (userInputs.password === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib dein Passwort ein.");
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(userInputs.email)) {
            this.notificationService.error("Eingabefehler", "Bitte gib eine gültige E-Mail-Adresse ein.");
            return;
        }

        this.disabledButton.set(true);
        this.submitButtonText.set("Laden...");

        const response = this.authService.login(userInputs.email, userInputs.password);

        response.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler", response.message);
                this.disabledButton.set(false);
                this.submitButtonText.set("Einloggen");
                return;
            }

            this.notificationService.success("Erfolg", response.message);
            this.authService.getCurrentUserDetails();

            this.submitButtonText.set("Eingeloggt");

            console.warn("The LoginComponent does not yet redirect to the location specified in the URL param ?redir=");
            this.router.navigate(["/"]);
        });
    }

    getUserInputs(): EmailPasswordCombo {
        return {
            email: this.emailInput().trim(),
            password: this.passwordInput().trim(),
        };
    }
}
