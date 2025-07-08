import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    currentTheme = signal<"light" | "dark">("light");

    setTheme(theme: "light" | "dark"): void {
        this.currentTheme.set(theme);
        document.documentElement.setAttribute("data-theme", theme);
        window.sessionStorage.setItem("theme", theme);
    }

    getTheme(): "light" | "dark" {
        return this.currentTheme();
    }

    toggleTheme(): void {
        const newTheme = this.currentTheme() === "light" ? "dark" : "light";
        this.setTheme(newTheme);
    }

    initTheme(): void {
        const storedTheme = window.sessionStorage.getItem("theme") as "light" | "dark";

        if (storedTheme === "light" || storedTheme === "dark") {
            this.setTheme(storedTheme);
            return;
        }

        console.warn("No valid theme found, defaulting to light.");
        this.setTheme("light");
    }
}
