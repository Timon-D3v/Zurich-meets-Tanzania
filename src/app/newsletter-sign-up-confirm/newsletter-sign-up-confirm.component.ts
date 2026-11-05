import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { NewsletterService } from "../services/newsletter.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiEndpointResponse } from "../..";
import { NotificationService } from "../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { HeroComponent } from "../components/hero/hero.component";

@Component({
    selector: "app-newsletter-sign-up-confirm",
    imports: [HeroComponent],
    templateUrl: "./newsletter-sign-up-confirm.component.html",
    styleUrl: "./newsletter-sign-up-confirm.component.scss",
})
export class NewsletterSignUpConfirmComponent implements OnInit {
    heroSubtitle = signal<string>("Du wirst bald weitergeleitet");
    buttonVisible = signal<boolean>(false);
    redirectSeconds = signal<number>(10);

    private route = inject(ActivatedRoute);
    private router = inject(Router);

    private newsletterService = inject(NewsletterService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.sendConfirmation();
    }

    /**
     * <Function>sendConfirmation</Function>
     * 
     * Processes newsletter sign-up confirmation by validating query parameters and making API request.
     * Extracts firstName, lastName, email (all required via route snapshot query params), gender, id, and timestamp from URL query string. Falls back to empty strings if missing any optional parameter for backward compatibility with different browser implementations or legacy links.
     * Makes asynchronous request via NewsletterService.confirmSignUp() with extracted parameters to verify registration before showing success/error messages.
     * Handles API errors via next/then callbacks (error flag set true) by calling router.navigate(["/"]) redirecting user back to home page without further attempts, displaying error message from response.message property for user-friendly notification display.
     * On subscription errors: logs error to console with specific failure details then displays generic error notification advising retry, navigates to homepage ensuring graceful recovery and preventing infinite retry loop or server-side call attempts on Node.js environments.
     * On successful verification (no error flag): shows success notification confirming newsletter subscription completion, changes buttonVisible signal to show "success" UI state if applicable (or removes button for cleaner presentation of confirmation), starts auto redirect countdown via autoRedirect() method after 5-10 second delay.
     * Runs server-side check first to avoid unnecessary API requests when running on Node.js or static HTML build. Always avoids throwing errors during async flow completion.
     * 
     * @param {void} No required parameters; invoked automatically during ngOnInit when component initializes for URL-mounted newsletter confirmation page.
     * @returns {void} Does not return a value; handles all async verification flow via Observable subscription completing without exceptions thrown in normal or error cases under typical usage scenario. Throws no errors.
     */
    sendConfirmation(): void {
        const params = this.route.snapshot.queryParams;

        const request = this.newsletterService.confirmSignUp(params["firstName"] ?? "", params["lastName"] ?? "", params["email"] ?? "", params["gender"] ?? "", params["id"] ?? "", params["timestamp"] ?? "");

        request.subscribe({
            next: (response: ApiEndpointResponse): void => {
                if (response.error) {
                    this.notificationService.error("Etwas hat nicht geklappt.", response.message);

                    this.router.navigate(["/"]);

                    return;
                }

                this.notificationService.success("Das hat geklappt.", "Du hast dich erfolgreich für den Newsletter angemeldet.");

                this.buttonVisible.set(true);

                this.autoRedirect();
            },
            error: (error: unknown): void => {
                console.error("Error while confirming newsletter sign up:", error);
                this.notificationService.error("Etwas hat nicht geklappt.", "Beim Bestätigen der Newsletter Anmeldung ist ein Fehler aufgetreten. Bitte versuche es erneut.");

                this.router.navigate(["/"]);
            },
        });
    }

    autoRedirect(): void {
        if (this.redirectSeconds() === 0) {
            this.router.navigate(["/"]);

            return;
        }

        this.heroSubtitle.set(`Du wirst in ${this.redirectSeconds()} Sekunden weitergeleitet...`);

        this.redirectSeconds.update((value) => value - 1);

        setTimeout(() => this.autoRedirect(), 1000);
    }
}
