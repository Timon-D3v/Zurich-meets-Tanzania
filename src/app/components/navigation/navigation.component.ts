import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { NavElement } from "../nav-element/nav-element";
import { DatabaseResult, NavLink } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { RouterLink } from "@angular/router";
import { BlogService } from "../../services/blog.service";
import { isPlatformBrowser } from "@angular/common";
import { NotificationService } from "../../services/notification.service";

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

    private blogService = inject(BlogService);
    private notificationService = inject(NotificationService);
    private platformId = inject(PLATFORM_ID);

    logOut(): void {
        console.error("Not implemented yet: Log out functionality in the navigation component.");
    }

    ngOnInit(): void {
        console.warn("Blog links need to be fetched in the navigation component.");
        console.warn("Gallery links need to be fetched in the navigation component.");
        console.warn("The navigation component should be able to check if the user is logged in.");
        console.warn("Log out functionality needs to be implemented in the navigation component.");
        console.warn("Nav Component needs to have a become member URL");
        console.warn("Nav component needs to have the current theme mode");

        this.setBlogLinks();
    }

    setBlogLinks(count: number = 5): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const blogTitles = this.blogService.getBlogsLinks();

        blogTitles.subscribe((response: DatabaseResult) => {
            if (response.error !== null) {
                console.error(response.error);
                this.notificationService.error(response.error);
                return;
            }

            this.blogLinks.set([]);

            response.data?.forEach((element: { title: string }) => {
                this.blogLinks().push({
                    label: element.title,
                    href: encodeURIComponent(element.title),
                });
            });

            this.blogLinks().push({
                label: "Weitere",
                href: "",
                external: true,
                onClick: () => this.setBlogLinks(count + 5),
            });
        });
    }
}
