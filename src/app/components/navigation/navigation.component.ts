import { Component, OnInit, signal } from "@angular/core";
import { NavElement } from "../nav-element/nav-element";
import { NavLink } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-navigation",
    imports: [NavElement, RouterLink],
    templateUrl: "./navigation.component.html",
    styleUrl: "./navigation.component.scss",
})
export class NavigationComponent implements OnInit {
    UNIKAT_URL = PUBLIC_CONFIG.UNIKAT_URL;
    blogLinks = signal<NavLink[]>([]);
    galleryLinks = signal<NavLink[]>([]);
    isLoggedIn = signal<boolean>(false);
    becomeMemberUrl = signal<string>("");
    currentThemeMode = signal<"Lightmode" | "Darkmode">("Lightmode");

    logOut() {
        console.error("Not implemented yet: Log out functionality in the navigation component.");
    }

    ngOnInit(): void {
        console.warn("Blog links need to be fetched in the navigation component.");
        console.warn("Gallery links need to be fetched in the navigation component.");
        console.warn("The navigation component should be able to check if the user is logged in.");
        console.warn("Log out functionality needs to be implemented in the navigation component.");
        console.warn("Nav Component needs to have a become member URL");
        console.warn("Nav component needs to have the current theme mode");
    }
}
