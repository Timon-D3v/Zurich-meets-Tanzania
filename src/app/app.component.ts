import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ThemeService } from "./services/theme.service";
import { timonjs_message } from "timonjs";
import { filter } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { NotificationsWrapperComponent } from "./components/notifications-wrapper/notifications-wrapper.component";
import { PUBLIC_CONFIG } from "../publicConfig";
import { AuthService } from "./services/auth.service";
import { StyleNamespaceService } from "./services/style-namespace.service";
import { HeaderService } from "./services/header.service";
import { NavigationService } from "./services/navigation.service";
import { SiteMetadataService } from "./services/site-metadata.service";
import { CookieBannerComponent } from "./components/cookie-banner/cookie-banner.component";
import { DonationMeterBannerComponent } from "./components/donation-meter-banner/donation-meter-banner.component";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, HeaderComponent, NavigationComponent, FooterComponent, NotificationsWrapperComponent, CookieBannerComponent, DonationMeterBannerComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    private router = inject(Router);

    private themeService = inject(ThemeService);
    private authService = inject(AuthService);
    private styleNamespaceService = inject(StyleNamespaceService);
    private headerService = inject(HeaderService);
    private navigationService = inject(NavigationService);
    private siteMetadataService = inject(SiteMetadataService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        timonjs_message();

        // Sets the default metadata
        this.siteMetadataService.setDefaultMetadata();

        // Sets the robot permissions for the route
        this.siteMetadataService.updateRobotsSettingsForRoute(this.router.url);

        // Sets the current site title and description before first page load
        this.siteMetadataService.updateMetadataForRoute(this.router.url);

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.themeService.initTheme();

        const navigationEndPipe = this.router.events.pipe(filter((event): boolean => event instanceof NavigationEnd));
        const navigationStartPipe = this.router.events.pipe(filter((event): boolean => event instanceof NavigationStart));

        navigationEndPipe.subscribe({
            next: (): void => {
                // The part below is called every time the route changes.

                // Close the mobile nav
                this.navigationService.closeNavigation();

                // Update the user object to bring it up to date
                this.authService.getCurrentUserDetails();

                // Update the current membership url in the header
                this.headerService.updateBecomeMemberUrl();

                // Loads the current user theme
                this.themeService.initTheme();

                // Strips the queryParameters so that the paths can match
                const currentUrlWithoutParameters = this.router.url.split("?")[0];
                const currentUrlWithoutHash = currentUrlWithoutParameters.split("#")[0];

                // Sets the correct style namespace for the current route
                if (PUBLIC_CONFIG.ROUTES.TYPES.HOME.includes(currentUrlWithoutHash)) {
                    this.styleNamespaceService.setHomeStyleNamespace();
                } else if (PUBLIC_CONFIG.ROUTES.TYPES.AUTH.includes(currentUrlWithoutHash)) {
                    this.styleNamespaceService.setAuthStyleNamespace();
                } else if (PUBLIC_CONFIG.ROUTES.TYPES.CONTACT.includes(currentUrlWithoutHash)) {
                    this.styleNamespaceService.setContactStyleNamespace();
                } else {
                    this.styleNamespaceService.setDefaultStyleNamespace();
                }

                // Sets the robot permissions for the route
                this.siteMetadataService.updateRobotsSettingsForRoute(currentUrlWithoutHash);

                // Sets the current metadata for the route
                this.siteMetadataService.updateMetadataForRoute(currentUrlWithoutHash);

                // Scroll to the top of the page
                if (isPlatformBrowser(this.platformId)) {
                    if (typeof this.router.url.split("#")[1] === "string") {
                        const elementId = this.router.url.split("#")[1];

                        const element = document.getElementById(elementId);

                        if (element !== null) {
                            element.scrollIntoView({ behavior: "smooth" });
                        } else {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }
                    } else {
                        window.scroll({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                        });
                    }
                }
            },
            error: (error: unknown): void => {
                console.error("Error during navigation end:", error);
            },
        });

        navigationStartPipe.subscribe({
            next: (): void => {
                // The part below is called every time the route could change.
            },
            error: (error: unknown): void => {
                console.error("Error during navigation start:", error);
            },
        });
    }
}
