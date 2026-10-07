import { Component, signal, OnInit, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { DonationMeter, GetDonationMetersApiEndpointResponse } from "../../..";
import { RouterLink } from "@angular/router";
import { DonationService } from "../../services/donation.service";
import { NotificationService } from "../../services/notification.service";
import { markdownToHtml } from "../../../shared/utils";

@Component({
    selector: "app-donation-meter-banner",
    imports: [RouterLink],
    templateUrl: "./donation-meter-banner.component.html",
    styleUrl: "./donation-meter-banner.component.scss",
})
export class DonationMeterBannerComponent implements OnInit {
    banners = signal<DonationMeter[]>([]);
    open = signal<boolean>(true);
    currentIndex = signal<number>(0);
    topbarTimer = signal<number>(0);
    topbarTimerInterval = 30_000; // Milliseconds (30 seconds)

    topbarInterval: any = null;

    private donationService = inject(DonationService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot fetch when not in browser context.");
            return;
        }

        this.getDonationMeters();

        if (window?.sessionStorage) {
            const donationMeterBannerClosed = window.sessionStorage.getItem("donationMeterBannerClosed");
            console.log("Donation meter banner closed state from session storage:", donationMeterBannerClosed);
            this.open.set(donationMeterBannerClosed !== "true");
        }
    }

    getDonationMeters(): void {
        const request = this.donationService.getDonationMeters();

        request.subscribe({
            next: (response: GetDonationMetersApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Der Spendenbanner konnte nicht geladen werden: " + response.message);

                    return;
                }

                this.banners.set(response.data);

                if (this.banners().length > 1) {
                    if (this.topbarInterval) {
                        clearInterval(this.topbarInterval);
                    }

                    this.topbarInterval = setInterval(() => {
                        this.incrementTimer();
                    }, 100);
                }
            },
            error: (error: any) => {
                console.error(error);

                this.notificationService.error("Netzwerkfehler:", "Beim Absenden des Formulars ist ein Fehler aufgetreten: " + error.message);
            },
        });
    }

    toggleBanner(): void {
        this.open.set(!this.open());

        if (window?.sessionStorage) {
            window.sessionStorage.setItem("donationMeterBannerClosed", this.open() ? "false" : "true");
        }
    }

    next(): void {
        this.currentIndex.update((index) => (index + 1) % this.banners().length);

        this.topbarTimer.set(0);
    }

    previous(): void {
        this.currentIndex.update((index) => (index === 0 ? this.banners().length - 1 : index - 1));

        this.topbarTimer.set(0);
    }

    incrementTimer(): void {
        this.topbarTimer.update((timer) => timer + 100);

        if (this.topbarTimer() === this.topbarTimerInterval) {
            this.next();
        }
    }

    generateGradient(currentValue: number, maxValue: number): string {
        const percentage = (currentValue / maxValue) * 100;
        return `linear-gradient(to right, var(--primary-500) 0%, var(--primary-500) ${percentage}%, transparent ${percentage}%, transparent 100%)`;
    }

    formatNumber(value: number): string {
        return new Intl.NumberFormat("de-CH").format(value);
    }

    markdownToHtml = markdownToHtml;
}
