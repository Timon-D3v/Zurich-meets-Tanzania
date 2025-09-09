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

@Component({
    selector: "app-root",
    imports: [RouterOutlet, HeaderComponent, NavigationComponent, FooterComponent, NotificationsWrapperComponent],
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

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        timonjs_message();

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.themeService.initTheme();

        const navigationEndPipe = this.router.events.pipe(filter((event): boolean => event instanceof NavigationEnd));
        const navigationStartPipe = this.router.events.pipe(filter((event): boolean => event instanceof NavigationStart));

        navigationEndPipe.subscribe((): void => {
            // The part below is called every time the route changes.

            // Close the mobile nav
            this.navigationService.closeNavigation();

            // Update the user object to bring it up to date
            this.authService.getCurrentUserDetails();

            // Update the current membership url in the header
            this.headerService.updateBecomeMemberUrl();

            // Loads the current user theme
            this.themeService.initTheme();

            // Sets the correct style namespace for the current route
            if (PUBLIC_CONFIG.ROUTES.TYPES.AUTH.includes(this.router.url)) {
                this.styleNamespaceService.setAuthStyleNamespace();
            } else if (PUBLIC_CONFIG.ROUTES.TYPES.CONTACT.includes(this.router.url)) {
                this.styleNamespaceService.setContactStyleNamespace();
            } else {
                this.styleNamespaceService.setDefaultStyleNamespace();
            }
        });

        navigationStartPipe.subscribe((): void => {
            // The part below is called every time the route could change.
        });
    }
}
