import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { PublicEnvService } from "../services/public-env.service";

@Component({
    selector: "app-privacy",
    imports: [],
    templateUrl: "./privacy.component.html",
    styleUrl: "./privacy.component.scss",
})
export class PrivacyComponent implements OnInit {
    readonly pdfUrl = PUBLIC_CONFIG.PRIVACY_PDF_URL;
    readonly pdfDownloadName = "Datenschutzerklärung ZMT.pdf";
    readonly name = PUBLIC_CONFIG.NAME;
    readonly address = PUBLIC_CONFIG.ADDRESS;
    readonly contactEmail = PUBLIC_CONFIG.PERSONAS["CHAIRMAN"].email;
    readonly developerName = PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name;
    readonly developerContactUrl = PUBLIC_CONFIG.PERSONAS["DEVELOPER"].website;

    date = new Date("2026-07-25T10:59:29.031Z").toLocaleString();

    origin = signal<string>("www.zurich-meets-tanzania.com");

    private publicEnvService = inject(PublicEnvService);
    private platformId = inject(PLATFORM_ID);

    async ngOnInit(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.origin.set(await this.publicEnvService.getOrigin());
    }
}
