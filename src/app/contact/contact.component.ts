import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ThemeService } from "../services/theme.service";
import { AuthService } from "../services/auth.service";
import { ContactService } from "../services/contact.service";
import { ApiEndpointResponse, GetContactRequestVerificationTokenApiEndpointResponse } from "../..";

@Component({
    selector: "app-contact",
    imports: [ReactiveFormsModule],
    templateUrl: "./contact.component.html",
    styleUrl: "./contact.component.scss",
})
export class ContactComponent implements OnInit {
    submitButtonText = signal("Absenden");
    submitButtonDisabled = signal(false);

    verificationCodeSent = signal(false);

    backgroundImageUrl = signal("/stock/sky.jpg");

    contactForm = new FormGroup({
        firstNameControl: new FormControl(""),
        lastNameControl: new FormControl(""),
        emailControl: new FormControl(""),
        messageControl: new FormControl(""),
    });

    contactVerificationForm = new FormGroup({
        tokenControl: new FormControl(""),
        verificationCodeControl: new FormControl(""),
    });

    private authService = inject(AuthService);
    private themeService = inject(ThemeService);
    private contactService = inject(ContactService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    private _updateBackgroundImageUrl = effect(() => {
        this.backgroundImageUrl.set(this.themeService.currentTheme() === "light" ? "/stock/sky.jpg" : "/stock/nightsky.jpg");
    });

    ngOnInit(): void {
        this.backgroundImageUrl.set(this.themeService.getTheme() === "light" ? "/stock/sky.jpg" : "/stock/nightsky.jpg");

        if (this.authService.isLoggedIn()) {
            this.autofill();
        }
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Versenden...");

        const firstName = this.contactForm.value.firstNameControl;
        const lastName = this.contactForm.value.lastNameControl;
        const email = this.contactForm.value.emailControl;
        const message = this.contactForm.value.messageControl;

        if (typeof firstName !== "string" || firstName.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib deinen Vornamen ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Absenden");

            return;
        }

        if (typeof lastName !== "string" || lastName.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib deinen Nachnamen ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Absenden");

            return;
        }

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Absenden");

            return;
        }

        if (typeof message !== "string" || message.trim() === "" || message.trim().length < 10) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine Nachricht ein. (Mindestens 10 Zeichen)");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Absenden");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Absenden");

            return;
        }

        const request = this.contactService.submitMessageAndGetVerificationToken(firstName.trim(), lastName.trim(), email.trim(), message.trim());

        request.subscribe((response: GetContactRequestVerificationTokenApiEndpointResponse) => {
            if (response.error || !response.data?.token) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Absenden");

                return;
            }

            this.notificationService.info("Bestätigung erforderlich:", "Um Spam zu vermeiden, bitten wir dich, deine E-Mail-Adresse zu bestätigen. Bitte gib den Code aus deinem Postfach ein, um deine Anfrage zu bestätigen.");

            this.contactForm.reset();

            this.verificationCodeSent.set(true);
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Bestätigen");

            console.info("Verification token:", response.data.token);
            this.contactVerificationForm.patchValue({
                tokenControl: response.data.token,
            });
        });
    }

    onVerificationSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Bestätigen...");

        const token = this.contactVerificationForm.value.tokenControl;
        const verificationCode = this.contactVerificationForm.value.verificationCodeControl;

        if (typeof token !== "string" || !/^[a-z0-9]{64}$/.test(token.toLowerCase())) {
            this.notificationService.error("Applikationsfehler:", "Es wurde kein gültiger Token übermittelt. Bitte lade die Seite neu und versuche es noch einmal.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Bestätigen");

            return;
        }

        if (typeof verificationCode !== "string" || !/^[a-z0-9]{10}$/.test(verificationCode.toLowerCase())) {
            this.notificationService.error("Eingabefehler:", "Bitte gib einen gültigen Bestätigungscode ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Bestätigen");

            return;
        }

        const request = this.contactService.confirmVerificationToken(token, verificationCode);

        request.subscribe((response: ApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler:", "Deine Anfrage konnte nicht bestätigt werden, da der Bestätigungscode ungültig oder abgelaufen ist.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Bestätigen");

                return;
            }

            this.notificationService.success("Versendet!", "Deine E-Mail-Adresse wurde erfolgreich bestätigt und deine Nachricht wurde versendet. Wir werden uns so schnell wie möglich bei dir melden.");

            this.verificationCodeSent.set(false);

            this.contactVerificationForm.reset();

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Absenden");
        });
    }

    autofill(): void {
        this.contactForm.patchValue({
            firstNameControl: this.authService.user()?.firstName ?? "",
            lastNameControl: this.authService.user()?.lastName ?? "",
            emailControl: this.authService.user()?.email ?? "",
        });
    }
}
