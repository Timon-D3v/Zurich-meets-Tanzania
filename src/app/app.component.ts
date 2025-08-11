import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ThemeService } from "./services/theme.service";
import { timonjs_message } from "timonjs";
import { filter } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, HeaderComponent, NavigationComponent, FooterComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    private router = inject(Router);

    private themeService = inject(ThemeService);

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
            this.themeService.initTheme();
        });

        navigationStartPipe.subscribe((): void => {
            // The part below is called every time the route could change.
        });
    }
}
