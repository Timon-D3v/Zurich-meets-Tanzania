import { Component, inject, PLATFORM_ID, signal, input, effect } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { DonationMeter } from "../../../..";
import { DonationService } from "../../../services/donation.service";

@Component({
    selector: "app-donations-push-donation-meter",
    imports: [ReactiveFormsModule],
    templateUrl: "./donations-push-donation-meter.component.html",
    styleUrl: "./donations-push-donation-meter.component.scss",
})
export class DonationsPushDonationMeterComponent {
    donationMeter = input<DonationMeter | null>(null);

    submitButtonText = signal("Aktualisieren");
    submitButtonDisabled = signal(false);

    updateDonationMeterForm = new FormGroup({
        titleControl: new FormControl(""),
        descriptionControl: new FormControl(""),
        currentValueControl: new FormControl(NaN),
        maxValueControl: new FormControl(NaN),
    });

    private donationService = inject(DonationService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    private _prefillValues = effect(() => {
        const meter = this.donationMeter();

        console.log("Prefilling form values for donation meter:", meter);

        if (meter) {
            this.updateDonationMeterForm.patchValue({
                titleControl: meter.title,
                descriptionControl: meter.description,
                currentValueControl: meter.currentValue,
                maxValueControl: meter.maxValue,
            });
        }
    });

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const title = this.updateDonationMeterForm.value.titleControl;
        const description = this.updateDonationMeterForm.value.descriptionControl;
        const currentValue = this.updateDonationMeterForm.value.currentValueControl;
        const maxValue = this.updateDonationMeterForm.value.maxValueControl;

        const donationMeterId = this.donationMeter()?.id;

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (typeof donationMeterId !== "number" || isNaN(donationMeterId)) {
            this.notificationService.error("Applikationsfehler:", "Es konnte kein gültiger Spendenziel-Identifikator gefunden werden. Bitte lade die Seite neu und versuche es erneut.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (typeof title !== "string" || title.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib dem Spendenziel einen Titel.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (typeof description !== "string" || description.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib dem Spendenziel eine Beschreibung.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (typeof currentValue !== "number" || isNaN(currentValue)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib dem Spendenziel einen gültigen aktuellen Wert.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (typeof maxValue !== "number" || isNaN(maxValue)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib dem Spendenziel einen gültigen Maximalwert.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        console.log("Submitting form with values:", {
            id: donationMeterId,
            title,
            description,
            currentValue,
            maxValue,
        });

        const request = this.donationService.updateDonationMeter(donationMeterId, title, description, currentValue, maxValue);

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", response.message);

                    this.submitButtonDisabled.set(false);
                    this.submitButtonText.set("Aktualisieren");

                    return;
                }

                this.notificationService.success("Erfolg:", "Das Spendenziel wurde erfolgreich aktualisiert.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Aktualisieren");
            },
            error: (error) => {
                console.error(error);
                this.notificationService.error("Netzwerk Fehler:", "Beim Aktualisieren des Spendenziels ist ein Fehler aufgetreten: " + error.message);
            },
        });

        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Aktualisieren");
    }
}
