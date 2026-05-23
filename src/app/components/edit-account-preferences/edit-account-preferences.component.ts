import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { getRandomHexString } from "../../../shared/utils";
import { ThemeService } from "../../services/theme.service";
import { NewsletterService } from "../../services/newsletter.service";
import { NotificationService } from "../../services/notification.service";
import { ApiEndpointResponse } from "../../../";

@Component({
    selector: "app-edit-account-preferences",
    imports: [],
    templateUrl: "./edit-account-preferences.component.html",
    styleUrl: "./edit-account-preferences.component.scss",
})
export class EditAccountPreferencesComponent implements OnInit {
    newsletterId = this.randomId();
    darkmodeId = this.randomId();
    darkmodeIsChecked = signal(false);
    newsletterIsChecked = signal(false);

    private themeService = inject(ThemeService);
    private newsletterService = inject(NewsletterService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.darkmodeIsChecked.set(this.themeService.currentTheme() === "dark");
        console.warn("Newsletter preference is currently not stored on the server. It will be reset to false on every page load.");
        this.newsletterIsChecked.set(false); // Set initial state for newsletter preference
    }

    toggleNewsletter(event: Event): void {
        event.preventDefault();

        this.newsletterIsChecked.set(!this.newsletterIsChecked());

        if (this.newsletterIsChecked()) {
            const request = this.newsletterService.signUpWithAccount("Divers");

            request.subscribe((response: ApiEndpointResponse): void => {
                if (response.error) {
                    this.notificationService.error("Fehler:", response.message);
                    return;

                }

                this.notificationService.success("Erfolg:", response.message);
            })
        } else {
            const request = this.newsletterService.signOutWithAccount();

            request.subscribe((response: ApiEndpointResponse): void => {
                if (response.error) {
                    this.notificationService.error("Fehler:", response.message);
                    return;

                }

                this.notificationService.success("Schade...", "Du hast dich erfolgreich vom Newsletter abgemeldet. Schade, dass du nicht mehr dabei sein möchtest!");
            })
        }

        
    }

    toggleDarkmode(event: Event): void {
        event.preventDefault();

        this.themeService.toggleTheme();
        this.darkmodeIsChecked.set(this.themeService.currentTheme() === "dark");
    }

    updateNewsletterGender(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request to update newsletter preference because the code is not running in the browser.");
            return;
        }

        const selectElement = event?.target as HTMLSelectElement;
        const selectedGender = selectElement?.value;

        if (!["Herr", "Frau", "Divers"].includes(selectedGender)) {
            this.notificationService.error("Ungültige Auswahl", "Bitte wähle eine gültige Anrede aus, um dich für den Newsletter anzumelden.");
            return;
        }

        const request = this.newsletterService.signUpWithAccount(selectedGender as "Herr" | "Frau" | "Divers");

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);
                return;

            }

            this.notificationService.success("Erfolg:", response.message);
        })
    }

    private randomId(length: number = 32): string {
        return getRandomHexString(length);
    }
}
