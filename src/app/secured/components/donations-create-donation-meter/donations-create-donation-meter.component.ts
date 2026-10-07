import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { ApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";
import { DonationService } from "../../../services/donation.service";

@Component({
    selector: "app-donations-create-donation-meter",
    imports: [ReactiveFormsModule],
    templateUrl: "./donations-create-donation-meter.component.html",
    styleUrl: "./donations-create-donation-meter.component.scss",
})
export class DonationsCreateDonationMeterComponent {
    submitButtonText = signal("Erstellen");
    submitButtonDisabled = signal(false);

    addDonationMeterForm = new FormGroup({
        titleControl: new FormControl(""),
        descriptionControl: new FormControl(""),
        targetControl: new FormControl(null),
    });

    private donationService = inject(DonationService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const title = this.addDonationMeterForm.value.titleControl;
        const description = this.addDonationMeterForm.value.descriptionControl;
        const target = this.addDonationMeterForm.value.targetControl;

        if (typeof title !== "string" || title.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib einen gültigen Titel ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (typeof description !== "string" || description.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Beschreibung ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (typeof target !== "number" || target <= 0 || isNaN(target)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib ein gültiges Spendenziel ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        const request = this.donationService.addDonationMeter(title, description, target);

        request.subscribe({
            next: (response: ApiEndpointResponse): void => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Beim Erstellen des Spenderbarometers ist ein Fehler aufgetreten. " + response.message);

                    this.submitButtonDisabled.set(false);
                    this.submitButtonText.set("Erstellen");

                    return;
                }

                this.notificationService.success("Erfolg:", `Der Spenderbarometer mit Titel "${title}" wurde erfolgreich erstellt.`);

                this.addDonationMeterForm.reset();

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Erstellen");
            },
            error: (error: unknown): void => {
                console.error("Error while adding donation meter:", error);
                this.notificationService.error("Fehler", "Beim Erstellen des Spenderbarometers ist ein Fehler aufgetreten. Bitte versuche es erneut.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Erstellen");
            },
        });
    }
}
