import { Component, OnInit, signal } from "@angular/core";
import { LogoComponent } from "../logo/logo.component";
import { HamburgerComponent } from "../hamburger/hamburger.component";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { ThemeSwitchComponent } from "../theme-switch/theme-switch.component";
import { HeaderLinkComponent } from "../header-link/header-link.component";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-header",
    imports: [LogoComponent, HamburgerComponent, ThemeSwitchComponent, HeaderLinkComponent, RouterLink],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
    UNIKAT_URL = PUBLIC_CONFIG.UNIKAT_URL;
    becomeMemberUrl = signal<string>("/spenden#scrollToMembership");

    ngOnInit(): void {
        console.warn("Header Component needs to have a become member URL");
    }
}
