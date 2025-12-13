import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { AuthInputComponent } from "../components/auth-input/auth-input.component";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponse, NewUser } from "../..";
import { AccountPictureInputComponent } from "../components/account-picture-input/account-picture-input.component";

@Component({
    selector: "app-signup",
    imports: [AuthInputComponent, RouterLink, AccountPictureInputComponent],
    templateUrl: "./signup.component.html",
    styleUrl: "./signup.component.scss",
})
export class SignupComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Account erstellen");

    accountPictureUrl = signal("/svg/personal.svg");

    emailInput = signal<string>("");
    passwordInput = signal<string>("");
    fistNameInput = signal<string>("");
    lastNameInput = signal<string>("");
    addressInput = signal<string>("");
    postalCodeInput = signal<string>("");
    cityInput = signal<string>("");
    phoneNumberInput = signal<string>("");
    accountPictureInput = signal<null | Blob>(null);

    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

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

    updateFirstNameInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.fistNameInput.set(input);
    }

    updateLastNameInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.lastNameInput.set(input);
    }

    updateAddressInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.addressInput.set(input);
    }

    updatePostalCodeInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.postalCodeInput.set(input);
    }

    updateCityInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.cityInput.set(input);
    }

    updatePhoneNumberInput(input: null | string | number | object): void {
        if (typeof input !== "string") {
            throw new Error(`Input type not allowed. Expected: string, Actual value: ${typeof input}`);
        }

        this.phoneNumberInput.set(input);
    }

    updateAccountImageInput(file: Blob | null): void {
        this.accountPictureInput.set(file);

        if (file === null) {
            this.accountPictureUrl.set("/svg/personal.svg");
            return;
        }

        this.accountPictureUrl.set(URL.createObjectURL(file));
    }

    login(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        event.preventDefault();

        const user = this.getUserInputs();

        const dataIsValid = this.validateUserData(user);

        if (!dataIsValid) {
            return;
        }

        this.disabledButton.set(true);
        this.submitButtonText.set("Wird erstellt...");

        const response = this.authService.signUp(user);

        response.subscribe(async (response: ApiEndpointResponse): Promise<void> => {
            if (response.error) {
                this.notificationService.error("Fehler", response.message);
                this.disabledButton.set(false);
                this.submitButtonText.set("Account erstellen");
                return;
            }

            this.notificationService.success("Erfolg", response.message);
            this.authService.getCurrentUserDetails();

            this.submitButtonText.set("Account erstellt");

            this.router.navigate(["/signup-confirm"], {
                queryParams: {
                    email: user.email,
                },
            });
        });
    }

    getUserInputs(): NewUser {
        return {
            email: this.emailInput().trim(),
            password: this.passwordInput().trim(),
            name: this.fistNameInput().trim(),
            family_name: this.lastNameInput().trim(),
            address: this.addressInput().trim(),
            postalCode: this.postalCodeInput().trim(),
            city: this.cityInput().trim(),
            phone: this.phoneNumberInput().replace(/\s/g, ""),
            picture: this.accountPictureInput(),
        };
    }

    validateUserData(user: NewUser): boolean {
        if (user.email === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib deine E-Mail-Adresse ein.");
            return false;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(user.email)) {
            this.notificationService.error("Eingabefehler", "Bitte gib eine gültige E-Mail-Adresse ein.");
            return false;
        }

        if (user.password === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib ein Passwort ein.");
            return false;
        }

        if (user.name === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib deinen Vornamen ein.");
            return false;
        }

        if (user.family_name === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib deinen Nachnamen ein.");
            return false;
        }

        if (user.address === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib deine Adresse ein.");
            return false;
        }

        if (user.postalCode === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib deine Postleitzahl ein.");
            return false;
        }

        if (!/^(?:[A-Z]{2}-\d{3,6}|\d{3,6})$/.test(user.postalCode)) {
            this.notificationService.error("Eingabefehler", "Bitte gib eine gültige Postleitzahl ein.");
            return false;
        }

        if (user.city === "") {
            this.notificationService.error("Leeres Feld", "Bitte gib die Stadt deiner Adresse ein.");
            return false;
        }

        if ((user.phone !== "" && user.phone.length > 15) || (user.phone !== "" && /[^0-9\+\ ]/.test(user.phone))) {
            this.notificationService.error("Eingabefehler", "Bitte gib eine gültige Telefonnummer ein oder lösche alle eingaben aus dem Feld.");
            return false;
        }

        return true;
    }
}
