import { Component, inject, OnInit, signal } from "@angular/core";
import { Donation, GetDonationHistoryApiEndpointResponse } from "../../../..";
import { DonationService } from "../../../services/donation.service";
import { NotificationService } from "../../../services/notification.service";
import { LoadingComponent } from "../../../components/loading/loading.component";
import { DonationRequestComponent } from "../../../components/donation-request/donation-request.component";

@Component({
    selector: "app-donations-form-entries",
    imports: [LoadingComponent, DonationRequestComponent],
    templateUrl: "./donations-form-entries.component.html",
    styleUrl: "./donations-form-entries.component.scss",
})
export class DonationsFormEntriesComponent implements OnInit {
    donationHistory = signal<Donation[]>([]);
    detailsOpen = signal<boolean>(false);

    PAGINATION_LIMIT = 10; // Limit the number of donation requests displayed to 10

    acceptedPagination = signal<number>(this.PAGINATION_LIMIT);
    rejectedPagination = signal<number>(this.PAGINATION_LIMIT);

    private donationService = inject(DonationService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.loadDonationHistory();
    }

    loadDonationHistory(): void {
        const request = this.donationService.getDonationHistory();

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

    toggleDetails(): void {
        this.detailsOpen.set(!this.detailsOpen());
    }

    pushAcceptedPagination(event: Event): void {
        event.preventDefault();

        this.acceptedPagination.update((value) => value + this.PAGINATION_LIMIT);
    }

    pushRejectedPagination(event: Event): void {
        event.preventDefault();

        this.rejectedPagination.update((value) => value + this.PAGINATION_LIMIT);
    }
}
