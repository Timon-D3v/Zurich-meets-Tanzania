import { Component, input, signal } from "@angular/core";
import { DelivApiFile } from "../../..";

@Component({
    selector: "app-gallery-image",
    imports: [],
    templateUrl: "./gallery-image.component.html",
    styleUrl: "./gallery-image.component.scss",
})
export class GalleryImageComponent {
    image = input.required<DelivApiFile>();
    transformation = input<string>("");
    keepTransformation = input<boolean>(false);

    stripTransformation = signal<boolean>(false);

    getFilePreviewUrl(file: DelivApiFile, stripTransformation: boolean): string {
        if (file.mimetype.startsWith("image/")) {
            const transformation = this.keepTransformation() || !stripTransformation ? this.transformation() : "";

            return file.url + transformation;
        } else if (file.mimetype.startsWith("video/")) {
            return "/svg/video.svg";
        } else if (file.mimetype.startsWith("audio/")) {
            return "/svg/audio.svg";
        } else if (file.mimetype === "application/pdf") {
            return "/svg/pdf.svg";
        } else {
            return "/svg/template.svg";
        }
    }

    getFilePreviewAlt(file: DelivApiFile): string {
        if (file.mimetype.startsWith("image/")) {
            return file.uuid;
        } else if (file.mimetype.startsWith("video/")) {
            return "Video";
        } else if (file.mimetype.startsWith("audio/")) {
            return "Audio";
        } else if (file.mimetype === "application/pdf") {
            return "PDF";
        } else {
            return "Unbekannter Dateityp";
        }
    }
}
