import { Component, effect, inject, OnChanges, OnDestroy, OnInit, PLATFORM_ID, signal, SimpleChanges } from "@angular/core";
import { NavElementComponent } from "../nav-element/nav-element.component";
import { DatabaseApiEndpointResponse, NavLink } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { RouterLink } from "@angular/router";
import { BlogService } from "../../services/blog.service";
import { isPlatformBrowser } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../services/auth.service";
import { GalleryService } from "../../services/gallery.service";
import { HeaderService } from "../../services/header.service";
import { ThemeService } from "../../services/theme.service";
import { NavigationService } from "../../services/navigation.service";

@Component({
    selector: "app-navigation",
    imports: [NavElementComponent, RouterLink],
    templateUrl: "./navigation.component.html",
    styleUrl: "./navigation.component.scss",
})
export class NavigationComponent implements OnInit, OnDestroy, OnChanges {
    constructor() {
        effect(() => {
            this.isLoggedIn.set(this.authService.isLoggedIn());
            this.becomeMemberUrl.set(this.headerService.becomeMemberUrl());
            this.currentThemeMode.set(this.themeService.currentTheme());
            this.mobileNavIsOpen.set(this.navigationService.navigationIsOpen());
        });
    }

    UNIKAT_URL = PUBLIC_CONFIG.UNIKAT_URL;
    blogLinks = signal<NavLink[]>([]);
    galleryLinks = signal<NavLink[]>([]);
    isLoggedIn = signal<boolean>(false);
    mobileNavIsOpen = signal<boolean>(false);
    becomeMemberUrl = signal<string>("");
    currentThemeMode = signal<"dark" | "light">("light");

    private navigationService = inject(NavigationService);
    private blogService = inject(BlogService);
    private galleryService = inject(GalleryService);
    private notificationService = inject(NotificationService);
    private authService = inject(AuthService);
    private headerService = inject(HeaderService);
    private themeService = inject(ThemeService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.setBlogLinks();
        this.setGalleryLinks();

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        window.addEventListener("resize", () => this.closeMobileNavigation());
        document.addEventListener("click", (event: MouseEvent) => this.closeMobileNavigationAfterOutsideClick(event));
    }

    ngOnDestroy(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        window.removeEventListener("resize", () => this.closeMobileNavigation());
        document.removeEventListener("click", (event: MouseEvent) => this.closeMobileNavigationAfterOutsideClick(event));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        window.removeEventListener("resize", () => this.closeMobileNavigation());
        window.addEventListener("resize", () => this.closeMobileNavigation());
    }

    logOut(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.authService.logout();
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
                    href: "/blog/" + encodeURIComponent(element.title),
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
                    href: "/gallery/" + encodeURIComponent(element.title),
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

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }

    closeMobileNavigation(): void {
        this.navigationService.closeNavigation();
    }

    closeMobileNavigationAfterOutsideClick(event: MouseEvent): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const wrapper = document.querySelector<HTMLElement>("app-navigation nav div.wrapper");
        const hamburger = document.querySelector<HTMLElement>("app-hamburger");

        if (wrapper === null || hamburger === null || event.target === null) {
            throw new Error(`No navigation wrapper, hamburger or event target found. Wrapper: ${wrapper}, Hamburger: ${hamburger}, Target: ${event.target}`);
        }

        const checkRecursiveIfChildrenAreTheEventTarget = (element: Element, target: EventTarget): boolean => {
            if (element === target) {
                return true;
            }

            const match = Array.from(element.children).some((value: Element) => checkRecursiveIfChildrenAreTheEventTarget(value, target));

            return match;
        };

        if (checkRecursiveIfChildrenAreTheEventTarget(wrapper, event.target) || checkRecursiveIfChildrenAreTheEventTarget(hamburger, event.target)) {
            return;
        }

        this.closeMobileNavigation();
    }
}
