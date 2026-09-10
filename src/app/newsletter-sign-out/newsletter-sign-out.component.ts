import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { NewsletterService } from "../services/newsletter.service";
import { ApiEndpointResponse, GetNewsletterUnsubscribeRequestVerificationTokenApiEndpointResponse } from "../..";

@Component({
    selector: "app-newsletter-sign-out",
    imports: [ReactiveFormsModule],
    templateUrl: "./newsletter-sign-out.component.html",
    styleUrl: "./newsletter-sign-out.component.scss",
})
export class NewsletterSignOutComponent {
    submitButtonText = signal<"Abmelden" | "Laden..." | "Bestätigen" | "Bestätigen...">("Abmelden");
    submitButtonDisabled = signal<boolean>(false);

    verificationCodeSent = signal<boolean>(false);

    displayEmail = signal<string>("");

    newsletterUnsubscribeForm = new FormGroup({
        emailControl: new FormControl(""),
    });

    newsletterUnsubscribeVerificationForm = new FormGroup({
        emailControl: new FormControl(""),
        tokenControl: new FormControl(""),
        verificationCodeControl: new FormControl(""),
    });

    private newsletterService = inject(NewsletterService);
    private notificationService = inject(NotificationService);

    private router = inject(Router);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Laden...");

        const email = this.newsletterUnsubscribeForm.value.emailControl;

        if (typeof email !== "string" || email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Abmelden");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Abmelden");

            return;
        }

        const request = this.newsletterService.signOut(email.trim());

        request.subscribe((response: GetNewsletterUnsubscribeRequestVerificationTokenApiEndpointResponse) => {
            if (response.error || !response.data?.token) {
                if (response.message === "Du bist nicht auf der Newsletterliste. Es gibt nichts mehr zu tun.") {
                    this.notificationService.info("Nicht auf der Liste:", response.message);
                } else {
                    this.notificationService.error("Fehler:", response.message);
                }

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Abmelden");

                return;
            }

            this.notificationService.info("Bestätigung erforderlich:", "Um Missbrauch zu vermeiden, bitten wir dich, deine E-Mail-Adresse zu bestätigen. Bitte gib den Code aus deinem Postfach ein, um deine Anfrage zu bestätigen.");

            this.newsletterUnsubscribeForm.reset();

            this.verificationCodeSent.set(true);
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Bestätigen");

            console.info("Verification token:", response.data.token);
            this.newsletterUnsubscribeVerificationForm.patchValue({
                tokenControl: response.data.token,
            });
        });
    }

    onVerificationSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Bestätigen...");

        const token = this.newsletterUnsubscribeVerificationForm.value.tokenControl;
        const verificationCode = this.newsletterUnsubscribeVerificationForm.value.verificationCodeControl;

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

        const request = this.newsletterService.confirmSignOut(verificationCode, token);

        request.subscribe((response: ApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler:", "Deine Anfrage konnte nicht bestätigt werden, da der Bestätigungscode ungültig oder abgelaufen ist.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Bestätigen");

                return;
            }

            this.notificationService.success("Abgemeldet", "Du hast dich erfolgreich vom Newsletter abgemeldet. Schade... Wenn du es dir noch einmal anders überlegst, kannst du dich jederzeit wieder anmelden.");

            this.router.navigate(["/"]);
        });
    }

    updateDisplayEmail(event: InputEvent): void {
        this.displayEmail.set((event?.target as HTMLInputElement)?.value ?? "");
    }
}
