import { Component, input, inject, output } from "@angular/core";
import { ApiEndpointResponse, Donation } from "../../..";
import { DonationService } from "../../services/donation.service";
import { NotificationService } from "../../services/notification.service";

@Component({
    imports: [],
    selector: "app-donation-request",
    styleUrl: "./donation-request.component.scss",
    templateUrl: "./donation-request.component.html",
})
export class DonationRequestComponent {
    donationRequest = input.required<Donation>();

    private donationService = inject(DonationService);
    private notificationService = inject(NotificationService);

    onValidate = output<void>();

    acceptRequest(): void {
        const request = this.donationService.verifyDonationRequest(this.donationRequest().id, true);

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Beim Akzeptieren der Spendenanfrage ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", "Die Spendenanfrage wurde erfolgreich akzeptiert.");
                this.onValidate.emit();
            },
            error: (error) => {
                console.error("Error while verifying donation request:", error);
                this.notificationService.error("Fehler:", "Beim Akzeptieren der Spendenanfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    rejectRequest(): void {
        const request = this.donationService.verifyDonationRequest(this.donationRequest().id, false);

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Beim Ablehnen der Spendenanfrage ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.info("Abgelehnt", "Die Spendenanfrage wurde erfolgreich abgelehnt.");
                this.onValidate.emit();
            },
            error: (error) => {
                console.error("Error while rejecting donation request:", error);
                this.notificationService.error("Fehler:", "Beim Ablehnen der Spendenanfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    formatNumber(value: number): string {
        return new Intl.NumberFormat("de-CH").format(value);
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("de-CH", {
            // weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
            // hour: "numeric",
            // minute: "2-digit",
        });
    }
}
