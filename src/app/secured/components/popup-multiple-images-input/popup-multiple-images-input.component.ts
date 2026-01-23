import { Component, inject, input, output, signal } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { PUBLIC_CONFIG } from "../../../../publicConfig";
import { CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
    selector: "app-popup-multiple-images-input",
    imports: [CdkDragPreview, CdkDropList, CdkDrag],
    templateUrl: "./popup-multiple-images-input.component.html",
    styleUrl: "./popup-multiple-images-input.component.scss",
})
export class PopupMultipleImagesInputComponent {
    title = input<string>("Bilder aussuchen:");
    description = input<string>("Bitte suche dir Bilder aus, die du hinzufügen möchtest und bringe sie in die richtige Reihenfolge. Du kannst sie auch nachher noch ändern.");
    label = input<string>("Bild:");
    placeholderUrl = input<string>(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);

    resultOutput = output<{ file: File; url: string }[]>();
    closeOutput = output<void>();

    images = signal<{ file: File; url: string }[]>([]);

    submitButtonDisabled = signal(false);
    submitButtonText = signal("Hinzufügen");

    private notificationService = inject(NotificationService);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        this.resultOutput.emit(this.images());

        this.reset();
    }

    reset(): void {
        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Hinzufügen");
    }

    close(): void {
        this.reset();
        this.closeOutput.emit();
    }

    onChange(event: Event): void {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }

        const inputElement = event.target;

        if (!inputElement.files || inputElement.files.length === 0) {
            this.notificationService.error("Keine Datei ausgewählt:", "Bitte wähle eine Bilddatei aus.");
            return;
        }

        const files = inputElement.files;

        this.images.set([]);

        for (const file of files) {
            const url = URL.createObjectURL(file);

            this.images.update((images) => {
                images.push({ file, url });

                return images;
            });
        }
    }

    moveElement(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.images(), event.previousIndex, event.currentIndex);
    }
}
