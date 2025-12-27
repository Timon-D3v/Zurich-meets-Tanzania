import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { ApiEndpointResponse, GetThemeApiEndpointResponse } from "../..";
import { debounceTime, lastValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    currentTheme = signal<"light" | "dark">("light");

    private debounceTimer = setTimeout(() => {}, 1);
    private readonly debounceDelay = 1000;

    private authService = inject(AuthService);
    private http = inject(HttpClient);

    private platformId = inject(PLATFORM_ID);

    setTheme(theme: "light" | "dark"): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.currentTheme.set(theme);

        document.documentElement.setAttribute("data-theme", theme);

        window.localStorage.setItem("theme", theme);

        if (!this.authService.isLoggedIn()) {
            return;
        }

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.setRemoteTheme(theme), this.debounceDelay);
    }

    setRemoteTheme(theme: "light" | "dark"): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (theme === window.localStorage.getItem("remote-theme")) {
            console.info("Set theme is already stored on the server. No request will be made");

            return;
        }

        const request = this.http.post<ApiEndpointResponse>("/api/secured/theme/set", {
            theme,
        });

        request.subscribe((response: ApiEndpointResponse) => {
            if (!response.error) {
                window.localStorage.setItem("remote-theme", theme);
            }
        });
    }

    getTheme(): "light" | "dark" {
        return this.currentTheme();
    }

    toggleTheme(): void {
        const newTheme = this.currentTheme() === "light" ? "dark" : "light";

        this.setTheme(newTheme);
    }

    async initTheme(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const remoteTheme = await this.fetchTheme();

        window.localStorage.setItem("remote-theme", remoteTheme === null ? "null" : remoteTheme);

        if (remoteTheme !== null) {
            this.setTheme(remoteTheme);

            return;
        }

        const storedTheme = window.localStorage.getItem("theme") as "light" | "dark";

        if (storedTheme === "light" || storedTheme === "dark") {
            this.setTheme(storedTheme);

            return;
        }

        console.warn("No valid theme found, defaulting to light.");

        this.setTheme("light");
    }

    async fetchTheme(): Promise<"light" | "dark" | null> {
        if (!this.authService.isLoggedIn()) {
            return null;
        }

        const response = await lastValueFrom(this.http.get<GetThemeApiEndpointResponse>("/api/secured/theme/get"));

        return response.data.theme;
    }
}
