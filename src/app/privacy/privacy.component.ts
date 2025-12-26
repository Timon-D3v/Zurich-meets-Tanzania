import { Component } from "@angular/core";
import { PUBLIC_CONFIG } from "../../publicConfig";

@Component({
    selector: "app-privacy",
    imports: [],
    templateUrl: "./privacy.component.html",
    styleUrl: "./privacy.component.scss",
})
export class PrivacyComponent {
    readonly pdfUrl = PUBLIC_CONFIG.PRIVACY_PDF_URL;
    readonly pdfDownloadName = "Datenschutzerklärung ZMT.pdf";
}
