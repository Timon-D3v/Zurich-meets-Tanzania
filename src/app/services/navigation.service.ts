import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class NavigationService {
    navigationIsOpen = signal<boolean>(false);

    openNavigation(): void {
        this.navigationIsOpen.set(true);
    }

    closeNavigation(): void {
        this.navigationIsOpen.set(false);
    }

    toggleNavigation(): void {
        this.navigationIsOpen.update((value: boolean) => !value);
    }
}
