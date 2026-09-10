import { Component, effect, inject, OnChanges, OnDestroy, OnInit, PLATFORM_ID, signal, SimpleChanges } from "@angular/core";
import { LogoComponent } from "../logo/logo.component";
import { HamburgerComponent } from "../hamburger/hamburger.component";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { ThemeSwitchComponent } from "../theme-switch/theme-switch.component";
import { HeaderLinkComponent } from "../header-link/header-link.component";
import { Router, RouterLink } from "@angular/router";
import { HeaderService } from "../../services/header.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-header",
    imports: [LogoComponent, HamburgerComponent, ThemeSwitchComponent, HeaderLinkComponent, RouterLink],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
    constructor() {
        effect(() => {
            this.becomeMemberUrl.set(this.headerService.becomeMemberUrl());
        });
    }

    UNIKAT_URL = PUBLIC_CONFIG.UNIKAT_URL;
    becomeMemberUrl = signal<"/membership" | "/account">("/membership");

    private headerService = inject(HeaderService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        setInterval(() => this.headerService.update(), 1000);

        window.addEventListener("resize", () => this.headerService.update());
        document.addEventListener("click", (event: MouseEvent) => this.closeAllFloatingNavElements(event));
    }

    ngOnDestroy(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        window.removeEventListener("resize", () => this.headerService.update());
        document.removeEventListener("click", (event: MouseEvent) => this.closeAllFloatingNavElements(event));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        window.removeEventListener("resize", () => this.headerService.update());
        window.addEventListener("resize", () => this.headerService.update());
    }

    moveNavElement(event: MouseEvent): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        event.stopPropagation();

        const target = event.target as null | HTMLElement;

        if (target === null) {
            throw new Error("Could not get target of MouseEvent.");
        }

        const index = Number(target.dataset["linkIndex"]);

        const floatingNavElements = document.querySelectorAll<HTMLElement>(".floating-nav-elements");
        const togglers = document.querySelectorAll<HTMLElement>("app-header-link > .navigator");

        if (floatingNavElements === null || floatingNavElements.length !== this.headerService.ELEMENTS_LENGTH) {
            throw new Error(`Incorrect floating navigation elements length. Expected: ${this.headerService.ELEMENTS_LENGTH}, Actual value: ${floatingNavElements.length}`);
        }

        if (togglers === null || togglers.length !== this.headerService.ELEMENTS_LENGTH) {
            throw new Error(`Incorrect header links length. Expected: ${this.headerService.ELEMENTS_LENGTH}, Actual value: ${togglers.length}`);
        }

        if (isNaN(index) || index > this.headerService.ELEMENTS_LENGTH - 1 || index < 1 - this.headerService.ELEMENTS_LENGTH) {
            throw new Error(`Index out of bounds. Greatest value allowed: ${this.headerService.ELEMENTS_LENGTH - 1}, Lowest value allowed: ${1 - this.headerService.ELEMENTS_LENGTH}, Actual value: ${index}`);
        }

        floatingNavElements.forEach((element: HTMLElement, i: number) => {
            if (i === index && !element.classList.contains("active")) {
                element.classList.add("active");
                togglers[i].classList.add("active");

                return;
            }

            element.classList.remove("active");
            togglers[i].classList.remove("active");
        });
    }

    closeAllFloatingNavElements(event: MouseEvent): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const floatingNavElements = document.querySelectorAll<HTMLElement>(".floating-nav-elements");
        const togglers = document.querySelectorAll<HTMLElement>("app-header-link");

        if (floatingNavElements === null || floatingNavElements.length !== this.headerService.ELEMENTS_LENGTH) {
            throw new Error(`Incorrect floating navigation elements length. Expected: ${this.headerService.ELEMENTS_LENGTH}, Actual value: ${floatingNavElements.length}`);
        }

        if (togglers === null || togglers.length !== this.headerService.ELEMENTS_LENGTH) {
            throw new Error(`Incorrect header links length. Expected: ${this.headerService.ELEMENTS_LENGTH}, Actual value: ${togglers.length}`);
        }

        if (!Array.from(floatingNavElements).some((element: HTMLElement) => element === event.target) || !Array.from(togglers).some((element: HTMLElement) => element === event.target)) {
            floatingNavElements.forEach((element: HTMLElement, i: number) => {
                element.classList.remove("active");
                togglers[i].querySelector(".navigator")?.classList.remove("active");
            });
        }
    }
}
