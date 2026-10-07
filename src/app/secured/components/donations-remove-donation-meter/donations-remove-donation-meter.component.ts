import { Component, OnInit, signal, inject } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";
import { DonationService } from "../../../services/donation.service";
import { GetDonationMetersApiEndpointResponse, DonationMeter } from "../../../..";

@Component({
    selector: "app-donations-remove-donation-meter",
    imports: [PopupSelectionInputComponent],
    templateUrl: "./donations-remove-donation-meter.component.html",
    styleUrl: "./donations-remove-donation-meter.component.scss",
})
export class DonationsRemoveDonationMeterComponent implements OnInit {
    donationMeterList = signal<DonationMeter[]>([]);
    selectionOpen = signal<boolean>(true);

    private donationService = inject(DonationService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.getAllGalleryTitles();
    }

    getAllGalleryTitles(): void {
        const request = this.donationService.getDonationMeters();

        request.subscribe({
            next: (response: GetDonationMetersApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der Spendenbarometer ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.donationMeterList.set(response.data);
            },
            error: (error) => {
                console.error("Error while fetching donation meter titles:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der Spendenbarometer ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    deactivateDonationMeter(title: string): void {
        this.closeSelection();

        let id = -1;

        for (const donationMeter of this.donationMeterList()) {
            if (donationMeter.title === title) {
                id = donationMeter.id;
                break;
            }
        }

        if (id === -1) {
            console.error("Could not find donation meter with title:", title);
            this.notificationService.error("Fehler:", "Beim Entfernen des Spendenbarometers ist ein Fehler aufgetreten. Bitte lade die Seite neu und versuche es erneut.");
            return;
        }

        const request = this.donationService.deactivateDonationMeter(id);

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Entfernen des Spendenbarometers ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", "Spendenbarometer erfolgreich entfernt.");
                this.getAllGalleryTitles();
            },
            error: (error) => {
                console.error("Error while removing gallery:", error);
                this.notificationService.error("Fehler:", "Beim Entfernen des Spendenbarometers ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    getOnlyTitles(donationMeters: DonationMeter[]): string[] {
        return donationMeters.map((donationMeter) => donationMeter.title);
    }

    openSelection(): void {
        this.selectionOpen.set(true);
    }

    closeSelection(): void {
        this.selectionOpen.set(false);
    }
}
