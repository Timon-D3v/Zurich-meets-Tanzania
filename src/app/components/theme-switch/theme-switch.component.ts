import { isPlatformBrowser } from "@angular/common";
import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { ThemeService } from "../../services/theme.service";

@Component({
    selector: "app-theme-switch",
    imports: [],
    templateUrl: "./theme-switch.component.html",
    styleUrl: "./theme-switch.component.scss",
})
export class ThemeSwitchComponent implements OnInit {
    constructor() {
        effect(() => {
            this.currentTheme.set(this.themeService.currentTheme());
        });
    }

    currentTheme = signal<"dark" | "light">("light");

    private platformId = inject(PLATFORM_ID);
    private themeService = inject(ThemeService);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.themeService.initTheme();
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
