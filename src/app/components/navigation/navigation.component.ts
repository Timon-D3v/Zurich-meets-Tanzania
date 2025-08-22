import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { NavElementComponent } from "../nav-element/nav-element.component";
import { DatabaseApiEndpointResponse, NavLink } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { RouterLink } from "@angular/router";
import { BlogService } from "../../services/blog.service";
import { isPlatformBrowser } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../services/auth.service";
import { GalleryService } from "../../services/gallery.service";

@Component({
    selector: "app-navigation",
    imports: [NavElementComponent, RouterLink],
    templateUrl: "./navigation.component.html",
    styleUrl: "./navigation.component.scss",
})
export class NavigationComponent implements OnInit {
    constructor() {
        effect(() => {
            this.isLoggedIn.set(this.authService.isLoggedIn());
        })
    }

    UNIKAT_URL = PUBLIC_CONFIG.UNIKAT_URL;
    blogLinks = signal<NavLink[]>([]);
    galleryLinks = signal<NavLink[]>([]);
    isLoggedIn = signal<boolean>(false);
    becomeMemberUrl = signal<string>("");
    currentThemeMode = signal<"Lightmode" | "Darkmode">("Lightmode");

    private blogService = inject(BlogService);
    private galleryService = inject(GalleryService);
    private notificationService = inject(NotificationService);
    private authService = inject(AuthService);

    private platformId = inject(PLATFORM_ID);

    logOut(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.authService.logout();
    }

    ngOnInit(): void {
        console.warn("Gallery links need to be fetched in the navigation component.");
        console.warn("Nav Component needs to have a become member URL");
        console.warn("Nav component needs to have the current theme mode");

        this.setBlogLinks();
        this.setGalleryLinks();
    }

    setBlogLinks(count: number = 5): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const request = this.blogService.getBlogsLinks(count);

        request.subscribe((response: DatabaseApiEndpointResponse) => {
            if (response.error) {
                console.error(response.message);
                this.notificationService.error("Fehler", "Blogs konnten nicht geladen werden, da keine Verbindung zur Datenbank möglich ist.");
                return;
            }

            this.blogLinks.set([]);

            response.data?.data?.forEach((element: { title: string }) => {
                this.blogLinks().push({
                    label: element.title,
                    href: encodeURIComponent(element.title),
                });
            });

            if (this.blogLinks().length === count) {
                this.blogLinks().push({
                    label: "Weitere",
                    href: "",
                    clickable: true,
                    onClick: () => this.setBlogLinks(count + 5),
                });
            }
        });
    }

    setGalleryLinks(count: number = 5): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const request = this.galleryService.getGalleryLinks(count);

        request.subscribe((response: DatabaseApiEndpointResponse) => {
            if (response.error) {
                console.error(response.message);
                this.notificationService.error("Fehler", "Galerien konnten nicht geladen werden, da keine Verbindung zur Datenbank möglich ist.");
                return;
            }

            this.galleryLinks.set([]);

            response.data?.data?.forEach((element: { title: string }) => {
                this.galleryLinks().push({
                    label: element.title,
                    href: encodeURIComponent(element.title),
                });
            });

            if (this.galleryLinks().length === count) {
                this.galleryLinks().push({
                    label: "Weitere",
                    href: "",
                    clickable: true,
                    onClick: () => this.setGalleryLinks(count + 5),
                });
            }
        });
    }
}
