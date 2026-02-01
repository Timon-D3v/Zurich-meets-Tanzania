import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import {
    CustomCurrentTeamElement,
    CustomImageElement,
    CustomImageWithTextElement,
    CustomLineElement,
    CustomMultipleImagesElement,
    CustomParagraphElement,
    CustomSubtitleElement,
    CustomTitleElement,
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
}
