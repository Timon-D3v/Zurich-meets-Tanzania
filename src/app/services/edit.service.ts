import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import {
    CustomTitleElement,
    CustomSubtitleElement,
    CustomParagraphElement,
    CustomImageElement,
    CustomMultipleImagesElement,
    CustomImageWithTextElement,
    CustomLineElement,
    CustomCurrentTeamElement,
    CustomBoardElement,
    CustomMultipleButtonsElement,
    CustomPdfViewerElement,
    CustomSourceElement,
    CustomTableElement,
    CustomMultipleListsElement,
    CustomVideoElement,
} from "../..";

@Injectable({
    providedIn: "root",
})
export class EditService {
    private notificationService = inject(NotificationService);

    private sanitizeStringWithoutWarning(input: string): string {
        if (input && typeof input === "string" && input.trim() !== "") {
            return input;
        }

        return "[Keine Eingabe]";
    }

    private sanitizeString(input: string): string {
        const output = this.sanitizeStringWithoutWarning(input);

        if (output === "[Keine Eingabe]") {
            this.notificationService.warn("Keine Eingabe", "Dem Element wurde kein Text hinzugefügt, es wurde aber trotzdem erstellt. Bitte lösche das Element wenn du es nicht brauchst.");
        }

        return output;
    }

    addTitle(content: string): CustomTitleElement {
        return {
            type: "title",
            content: this.sanitizeString(content),
        };
    }

    addSubtitle(content: string): CustomSubtitleElement {
        return {
            type: "subtitle",
            content: this.sanitizeString(content),
        };
    }

    addParagraph(content: string): CustomParagraphElement {
        return {
            type: "paragraph",
            content: this.sanitizeString(content),
        };
    }

    addImage(imageUrl: string, imageAlt: string): CustomImageElement {
        return {
            type: "image",
            imageUrl,
            imageAlt: this.sanitizeStringWithoutWarning(imageAlt),
        };
    }

    addMultipleImages(images: { imageUrl: string; imageAlt: string }[]): CustomMultipleImagesElement {
        return {
            type: "multipleImages",
            images,
        };
    }

    addImageWithText(imageUrl: string, imageAlt: string, content: string, sideOfImage: "left" | "right"): CustomImageWithTextElement {
        return {
            type: "imageWithText",
            imageUrl,
            imageAlt: this.sanitizeStringWithoutWarning(imageAlt),
            content: this.sanitizeString(content),
            sideOfImage: sideOfImage === "left" ? "left" : "right",
        };
    }

    addLine(): CustomLineElement {
        return {
            type: "line",
        };
    }

    addCurrentTeam(teamId: number): CustomCurrentTeamElement {
        return {
            type: "currentTeam",
            teamId: teamId,
        };
    }

    addBoard(): CustomBoardElement {
        return {
            type: "board",
        };
    }

    addPdfViewer(pdfUrl: string): CustomPdfViewerElement {
        return {
            type: "pdfViewer",
            pdfUrl,
        };
    }

    addSource(content: string, sourceUrl: string): CustomSourceElement {
        return {
            type: "source",
            content: this.sanitizeString(content),
            sourceUrl: this.sanitizeString(sourceUrl),
        };
    }

    addVideo(videoUrl: string, videoType: string): CustomVideoElement {
        return {
            type: "video",
            videoType,
            videoUrl: videoUrl,
        };
    }

    addTable(headers: Array<CustomSubtitleElement | CustomImageElement>, rows: Array<Array<CustomParagraphElement | CustomImageElement>>, sourceContent?: string, sourceUrl?: string): CustomTableElement {
        return {
            type: "table",
            headers,
            rows,
            source:
                sourceContent && sourceUrl
                    ? {
                          content: this.sanitizeString(sourceContent),
                          url: this.sanitizeString(sourceUrl),
                      }
                    : undefined,
        };
    }

    addMultipleLists(
        lists: {
            title: string;
            items: string[];
        }[],
    ): CustomMultipleListsElement {
        return {
            type: "multipleLists",
            lists,
        };
    }

    addMultipleButtons(
        buttons: {
            content: string;
            url: string;
            secondary: boolean;
        }[],
    ): CustomMultipleButtonsElement {
        return {
            type: "multipleButtons",
            buttons,
        };
    }
}
