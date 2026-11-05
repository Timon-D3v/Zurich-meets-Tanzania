import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { AuthInputComponent } from "../components/auth-input/auth-input.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
    private route = inject(ActivatedRoute);

    private platformId = inject(PLATFORM_ID);

    updateEmailInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.emailInput.set(input);
    }

    updatePasswordInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.passwordInput.set(input);
    }

    /**
     * <Function>login</Function>
     * 
     * Handles form submission for user login with email and password authentication.
     * Checks browser context first (returns early on non-browser platforms to avoid server-side authentication attempts).
     * Prevents default event behavior and validates both email (required, not empty, valid regex pattern) and password fields.
     * Shows loading state by disabling submit button and updating text to "Laden..." during API request.
     * Makes login API call via AuthService.login() with user credentials. On success: shows notification with response message, refreshes user data from getCurrentUserDetails(), updates submit button text to "Eingeloggt" for confirmation display.
     * Handles API error responses by showing error notifications without clearing form inputs, resets button state enabling retry attempts.
     * After successful authentication calls redirectUserAfterLogin() which redirects to stored redirectUrl query parameter if exists (uses setInterval with up to 20 retries of polling isLoggedIn signal until user is authenticated or max retries exceeded) otherwise redirects to home page (/).
     * Returns early without errors in all edge cases ensuring graceful browser/server-side handling.
     * 
     * @param {Event} event - The submit event triggered by clicking the login form's submit button (prevented default behavior and propagated via stopPropagation or direct call if needed for component functionality).
     * @returns {void} Does not return a value; handles asynchronous login flow via Observable subscription completing on success, error or redirect with no errors thrown. Throws only when input is wrong type in updateEmailInput/updatePasswordInput private methods (not in login itself which validates strings first).
     */
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

        if (!PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(userInputs.email)) {
            this.notificationService.error("Eingabefehler", "Bitte gib eine gültige E-Mail-Adresse ein.");
            return;
        }

        this.disabledButton.set(true);
        this.submitButtonText.set("Laden...");

        const response = this.authService.login(userInputs.email, userInputs.password);

        response.subscribe(async (response: ApiEndpointResponse): Promise<void> => {
            if (response.error) {
                this.notificationService.error("Fehler", response.message);
                this.disabledButton.set(false);
                this.submitButtonText.set("Einloggen");
                return;
            }

            this.notificationService.success("Erfolg", response.message);
            this.authService.getCurrentUserDetails();

            this.submitButtonText.set("Eingeloggt");

            this.redirectUserAfterLogin();
        });
    }

    redirectUserAfterLogin(): void {
        const queryParams = this.route.snapshot.queryParams;

        if ("redirectUrl" in queryParams) {
            let retries = 0;

            const redirectInterval = setInterval(() => {
                console.log(this.authService.user(), this.authService.isLoggedIn());

                if (this.authService.isLoggedIn()) {
                    clearInterval(redirectInterval);

                    this.router.navigate([queryParams["redirectUrl"]]);
                } else if (retries === 20) {
                    clearInterval(redirectInterval);

                    this.router.navigate(["/"]);
                }

                retries++;
            }, 100);

            return;
        }

        this.router.navigate(["/"]);
    }

    getUserInputs(): EmailPasswordCombo {
        return {
            email: this.emailInput().trim(),
            password: this.passwordInput().trim(),
        };
    }
}
