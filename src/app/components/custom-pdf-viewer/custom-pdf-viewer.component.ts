import { Component, input, signal, effect, inject } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { SanitizerService } from "../../services/sanitizer.service";

@Component({
    selector: "app-custom-pdf-viewer",
    imports: [],
    templateUrl: "./custom-pdf-viewer.component.html",
    styleUrl: "./custom-pdf-viewer.component.scss",
})
export class CustomPdfViewerComponent {
    pdfUrl = input.required<string>();

    private sanitizerService = inject(SanitizerService);

    private sanitizer = inject(DomSanitizer);

    sanitizedUrl = signal<SafeResourceUrl>(this.sanitizer.bypassSecurityTrustResourceUrl("about:blank"));

    private _sanitizeEffect = effect(async () => {
        const pdfUrl = await this.sanitizePdfUrl(this.pdfUrl());

        console.log("Sanitized PDF URL:", pdfUrl);

        this.sanitizedUrl.set(pdfUrl);
    });

    async sanitizePdfUrl(url: any): Promise<SafeResourceUrl> {
        const backupUrl = this.sanitizer.bypassSecurityTrustResourceUrl("about:blank");

        if (typeof url === "string") {
            const isTrusted = await this.sanitizerService.verifyUrlIsTrusted(url);

            if (isTrusted) {
                return this.sanitizer.bypassSecurityTrustResourceUrl(url);
            }
        }

        return backupUrl;
    }
}
