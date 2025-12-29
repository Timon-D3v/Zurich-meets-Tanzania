import { Component, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FooterService } from "../../services/footer.service";
import { NotificationService } from "../../services/notification.service";
import { AddToNewsletterListApiEndpointResponse } from "../../..";

@Component({
    selector: "app-footer-newsletter-sign-up-form",
    imports: [ReactiveFormsModule],
    templateUrl: "./footer-newsletter-sign-up-form.component.html",
    styleUrl: "./footer-newsletter-sign-up-form.component.scss",
})
export class FooterNewsletterSignUpFormComponent {
    submitButtonText = signal("Anmelden");
    submitButtonDisabled = signal(false);

    newsletterSignUpForm = new FormGroup({
        isMaleControl: new FormControl(false),
        isFemaleControl: new FormControl(false),
        firstNameControl: new FormControl(""),
        lastNameControl: new FormControl(""),
        emailControl: new FormControl(""),
    });

    private footerService = inject(FooterService);
    private notificationService = inject(NotificationService);

    onSubmit(event: Event): void {
        event.preventDefault();

        const firstName = this.newsletterSignUpForm.value.firstNameControl;
        const lastName = this.newsletterSignUpForm.value.lastNameControl;
        const email = this.newsletterSignUpForm.value.emailControl;

        const isMale = this.newsletterSignUpForm.value.isMaleControl;
        const isFemale = this.newsletterSignUpForm.value.isFemaleControl;

        let gender: "Herr" | "Frau" | "Divers" = "Divers";

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        if (typeof firstName !== "string" || firstName === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib deinen Vornamen an.");
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Anmelden");
            return;
        }

        if (typeof lastName !== "string" || lastName === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib deinen Nachnamen an.");
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Anmelden");
            return;
        }

        if (typeof email !== "string" || email === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Anmelden");
            return;
        }

        if (typeof isMale === "boolean" && isMale) {
            gender = "Herr";
        }

        if (typeof isFemale === "boolean" && isFemale) {
            gender = "Frau";
        }

        const request = this.footerService.addToNewsletterList(firstName, lastName, email, gender);

        request.subscribe((response: AddToNewsletterListApiEndpointResponse): void => {
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Anmelden");

            if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                return;
            }

            if (response.data.alreadyLoggedIn) {
                this.notificationService.info("Info:", "Du bist bereits auf der Newsletter-Liste.");

                return;
            }

            this.notificationService.success("Vielen Dank!", response.message);
            this.newsletterSignUpForm.reset();
        });
    }

    disableIsMaleCheckbox(): void {
        this.newsletterSignUpForm.patchValue({
            isMaleControl: false,
        });
    }

    disableIsFemaleCheckbox(): void {
        this.newsletterSignUpForm.patchValue({
            isFemaleControl: false,
        });
    }
}
