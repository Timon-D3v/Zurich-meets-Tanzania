import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { NavigationService } from "../../services/navigation.service";

@Component({
    selector: "app-hamburger",
    imports: [],
    templateUrl: "./hamburger.component.html",
    styleUrl: "./hamburger.component.scss",
})
export class HamburgerComponent {
    constructor() {
        effect(() => {
            this.isOpen.set(this.navigationService.navigationIsOpen());
        });
    }

    isOpen = signal<boolean>(false);

    private navigationService = inject(NavigationService);

    toggleHamburger(): void {
        this.isOpen.update((value: boolean) => !value);

        if (this.isOpen()) {
            this.navigationService.openNavigation();
        } else {
            this.navigationService.closeNavigation();
        }
    }
}
