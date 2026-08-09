import { Component, effect, input, output, signal } from "@angular/core";
import { DelivApiFile } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { LoadingComponent } from "../loading/loading.component";

@Component({
    selector: "app-gallery-image-preview",
    imports: [LoadingComponent],
    templateUrl: "./gallery-image-preview.component.html",
    styleUrl: "./gallery-image-preview.component.scss",
})
export class GalleryImagePreviewComponent {
    image = input.required<DelivApiFile>();

    closeOutput = output<void>();
    nextOutput = output<void>();
    previousOutput = output<void>();

    blurred = signal<boolean>(false);

    private _updateSource = effect(async () => {
        this.image();

        this.blurred.set(true);
    });

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
