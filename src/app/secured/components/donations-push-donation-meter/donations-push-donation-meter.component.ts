import { Component, inject, PLATFORM_ID, signal, input, effect, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { Donation, DonationMeter, GetDonationHistoryApiEndpointResponse, GetDonationMetersApiEndpointResponse } from "../../../..";
import { DonationService } from "../../../services/donation.service";
import { DonationRequestComponent } from "../../../components/donation-request/donation-request.component";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";

@Component({
    selector: "app-donations-push-donation-meter",
    imports: [ReactiveFormsModule, DonationRequestComponent, PopupSelectionInputComponent],
    templateUrl: "./donations-push-donation-meter.component.html",
    styleUrl: "./donations-push-donation-meter.component.scss",
})
export class DonationsPushDonationMeterComponent implements OnInit {
    donationMeters = signal<DonationMeter[]>([{ title: "Wird geladen...", description: "", currentValue: 0, maxValue: 0, active: true, id: -1, updatedAt: "" }]);
    donationMeterToEdit = signal<DonationMeter | null>(null);
    donationHistory = signal<Donation[]>([]);

    submitButtonText = signal("Aktualisieren");
    submitButtonDisabled = signal(false);
    selectionOpen = signal(true);
    selectionDisabled = signal(true);

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
        const meter = this.donationMeterToEdit();

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

    ngOnInit(): void {
        this.getAllDonationMeters();
        this.loadOpenDonationRequests();
    }

    getAllDonationMeters(): void {
        const donationMeterRequest = this.donationService.getDonationMeters();

        donationMeterRequest.subscribe({
            next: (response: GetDonationMetersApiEndpointResponse) => {
                if (response.error || response.data === null || !Array.isArray(response.data)) {
                    this.notificationService.error("Fehler beim Laden der Spendenziele", "Die Spendenziele konnten nicht geladen werden: " + response.message);

                    return;
                }

                this.donationMeters.set(response.data);
                this.selectionDisabled.set(false);
            },
            error: (error) => {
                console.error("Error while fetching donation meters:", error);
                this.notificationService.error("Fehler beim Laden der Spendenziele", "Die Spendenziele konnten nicht geladen werden. Bitte versuche es später erneut.");
            },
        });
    }

    loadOpenDonationRequests(): void {
        const request = this.donationService.getOpenDonationRequests();

        request.subscribe({
            next: (response: GetDonationHistoryApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Beim Abrufen der Spendenhistorie ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.donationHistory.set(response.data);
            },
            error: (error) => {
                console.error("Error while fetching donation history:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der Spendenhistorie ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const title = this.updateDonationMeterForm.value.titleControl;
        const description = this.updateDonationMeterForm.value.descriptionControl;
        const currentValue = this.updateDonationMeterForm.value.currentValueControl;
        const maxValue = this.updateDonationMeterForm.value.maxValueControl;

        const donationMeterId = this.donationMeterToEdit()?.id;

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

    selectDonationMeter(title: string): void {
        this.donationMeterToEdit.set(this.donationMeters().find((meter) => meter.title === title) || null);

        this.closeSelection();
    }

    openSelection(): void {
        this.selectionOpen.set(true);
    }

    closeSelection(): void {
        this.selectionOpen.set(false);
    }
}
