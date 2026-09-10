import { Component, input, signal } from "@angular/core";
import { NavLink, NavLinkPicture } from "../../../..";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-admin-nav-element",
    imports: [RouterLink],
    templateUrl: "./admin-nav-element.component.html",
    styleUrl: "./admin-nav-element.component.scss",
})
export class AdminNavElementComponent {
    description = input<string>("");
    withPicture = input<boolean>(false);
    pictureArray = input<NavLinkPicture[]>([]);
    linkArray = input<NavLink[]>([]);

    isOpen = signal<boolean>(false);

    openDetails(): void {
        this.isOpen.set(true);
    }

    closeDetails(): void {
        this.isOpen.set(false);
    }

    toggleDetails(): void {
        this.isOpen.update((value: boolean) => !value);
    }
}
