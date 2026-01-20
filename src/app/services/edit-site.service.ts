import { inject, Injectable } from "@angular/core";
import {
    ApiEndpointResponse,
    CustomCurrentTeamElement,
    CustomImageElement,
    CustomImageWithTextElement,
    CustomLineElement,
    CustomMultipleImagesElement,
    CustomParagraphElement,
    CustomSubtitleElement,
    CustomTitleElement,
    StaticSite,
    StaticSiteNames,
} from "../..";
import { NotificationService } from "./notification.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class EditSiteService {
    private notificationService = inject(NotificationService);
    private http = inject(HttpClient);

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

    addCurrentTeam(): CustomCurrentTeamElement {
        console.error("Not implemented yet");
        return {
            type: "currentTeam",
            teamId: 0,
        };
    }

    submitSite(siteName: StaticSiteNames, site: StaticSite, images: { url: string; file: File }[]): Observable<ApiEndpointResponse> {
        const formData = new FormData();

        const imageNames = images.map((image) => image.url);

        formData.append("siteName", siteName);
        formData.append("site", JSON.stringify(site));
        formData.append("imageNames", JSON.stringify(imageNames));

        images.forEach((image) => {
            formData.append("images", image.file);
        });

        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/management/updateStaticSite", formData);

        return request;
    }
}
