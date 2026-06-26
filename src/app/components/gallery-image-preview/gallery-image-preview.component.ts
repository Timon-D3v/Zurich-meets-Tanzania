import { Component, input, output } from "@angular/core";
import { DelivApiFile } from "../../..";

@Component({
    selector: "app-gallery-image-preview",
    imports: [],
    templateUrl: "./gallery-image-preview.component.html",
    styleUrl: "./gallery-image-preview.component.scss",
})
export class GalleryImagePreviewComponent {
    image = input.required<DelivApiFile>();

    closeOutput = output<void>();
    nextOutput = output<void>();
    previousOutput = output<void>();

    close(): void {
        this.closeOutput.emit();
    }

    next(): void {
        this.nextOutput.emit();
    }

    previous(): void {
        this.previousOutput.emit();
    }
}
