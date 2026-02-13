import { Component, effect, inject, input, OnDestroy, output, PLATFORM_ID, signal } from "@angular/core";
import { News } from "../../../..";
import { PUBLIC_CONFIG } from "../../../../publicConfig";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { SanitizerService } from "../../../services/sanitizer.service";
import { CustomTitleComponent } from "../../../components/custom-title/custom-title.component";
import { CustomSubtitleComponent } from "../../../components/custom-subtitle/custom-subtitle.component";
import { CustomParagraphComponent } from "../../../components/custom-paragraph/custom-paragraph.component";
import { CustomImageComponent } from "../../../components/custom-image/custom-image.component";
import { CustomImageCarouselComponent } from "../../../components/custom-image-carousel/custom-image-carousel.component";
import { CustomImageWithTextComponent } from "../../../components/custom-image-with-text/custom-image-with-text.component";
import { CustomLineComponent } from "../../../components/custom-line/custom-line.component";
import { TeamFromIdComponent } from "../../../components/team-from-id/team-from-id.component";
import { CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList } from "@angular/cdk/drag-drop";

@Component({
    selector: "app-news-edit-news",
    imports: [CustomTitleComponent, CustomSubtitleComponent, CustomParagraphComponent, CustomImageComponent, CustomImageCarouselComponent, CustomImageWithTextComponent, CustomLineComponent, TeamFromIdComponent, CdkDragPreview, CdkDropList, CdkDrag],
    templateUrl: "./news-edit-news.component.html",
    styleUrl: "./news-edit-news.component.scss",
})
export class NewsEditNewsComponent implements OnDestroy {
    newsTitle = input<string | null>(null);
    news = input<News>(PUBLIC_CONFIG.NEWS.LOADING(PUBLIC_CONFIG.FALLBACK_IMAGE_URL));

    pdfUrl = signal<SafeResourceUrl>("about:blank");

    moveOutput = output<CdkDragDrop<string[]>>();
    editOutput = output<number>();
    deleteOutput = output<number>();

    readonly FALLBACK_IMAGE_URL = PUBLIC_CONFIG.FALLBACK_IMAGE_URL;

    private sanitizerService = inject(SanitizerService);

    private sanitizer = inject(DomSanitizer);

    private _updatePdfUrl = effect(async () => {
        const pdfUrl = await this.sanitizePdfUrl(this.news().data?.pdfUrl);

        console.log("Sanitized PDF URL:", pdfUrl, "(Original URL:", this.news().data?.pdfUrl, ")");

        this.pdfUrl.set(pdfUrl);
    });

    private _updatePdfUrlAllTheTime = setInterval(async () => {
        if (this.news().data.type !== "pdf") {
            return;
        }

        const pdfUrl = await this.sanitizePdfUrl(this.news().data?.pdfUrl);

        if (pdfUrl.toString() === this.pdfUrl().toString()) {
            return;
        }

        this.pdfUrl.set(pdfUrl);
    }, 500);

    ngOnDestroy(): void {
        clearInterval(this._updatePdfUrlAllTheTime);
    }

    moveElement(event: CdkDragDrop<string[]>): void {
        this.moveOutput.emit(event);
    }

    editElement(index: number): void {
        this.editOutput.emit(index);
    }

    deleteElement(index: number): void {
        this.deleteOutput.emit(index);
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    formatTitleDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("de-DE", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

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
