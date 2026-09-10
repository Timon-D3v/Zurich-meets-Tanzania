import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { CookieConsentService } from "../../services/cookie-consent.service";
import { isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-cookie-banner",
    imports: [RouterLink],
    templateUrl: "./cookie-banner.component.html",
    styleUrl: "./cookie-banner.component.scss",
})
export class CookieBannerComponent implements OnInit {
    private cookieConsentService = inject(CookieConsentService);
    private platformId = inject(PLATFORM_ID);

    hidden = signal<boolean>(this.cookieConsentService.hasAcceptedCookies() || this.cookieConsentService.hasRejectedCookies());

    /**
     * Angular lifecycle hook that is called after the component's view has been fully initialized.
     *
     * This method performs the following actions:
     * 1. Checks if the code is running in a browser environment. If not, it returns early.
     * 2. Initializes the cookie consent service.
     * 3. If cookies have already been accepted, it re-applies the acceptance.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.cookieConsentService.init();

        if (this.cookieConsentService.hasAcceptedCookies()) {
            this.cookieConsentService.acceptCookies();
        }
    }

    /**
     * Accepts the cookies by calling the cookie consent service and hides the cookie banner.
     *
     * This method performs the following actions:
     * 1. Calls the `acceptCookies` method of the `cookieConsentService` to register the user's consent.
     * 2. Sets the `hidden` property to `true` to hide the cookie banner.
     *
     * @returns {void}
     */
    acceptCookies(): void {
        this.cookieConsentService.acceptCookies();
        this.hidden.set(true);
    }

    /**
     * Rejects the cookies by calling the `rejectCookies` method of the `cookieConsentService`
     * and sets the `hidden` property to true to hide the cookie banner.
     *
     * @returns {void}
     */
    rejectCookies(): void {
        this.cookieConsentService.rejectCookies();
        this.hidden.set(true);
    }
}
