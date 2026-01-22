import { Component, inject, input, output, signal } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { PUBLIC_CONFIG } from "../../../../publicConfig";

@Component({
    selector: "app-popup-image-input",
    imports: [],
    templateUrl: "./popup-image-input.component.html",
    styleUrl: "./popup-image-input.component.scss",
})
export class PopupImageInputComponent {
    title = input<string>("Bild aussuchen:");
    description = input<string>("Bitte suche ein Bild aus, das du hinzufügen möchtest. Du kannst es auch nachher noch ändern.");
    label = input<string>("Bild:");
    placeholderUrl = input<string>(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);

    resultOutput = output<{ file: File | null; url: string }>();
    closeOutput = output<void>();

    image = signal<{ file: File | null; url: string }>({
        file: null,
        url: this.placeholderUrl(),
    });

    submitButtonDisabled = signal(false);
    submitButtonText = signal("Hinzufügen");

    private notificationService = inject(NotificationService);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        this.resultOutput.emit(this.image());

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

        const file = inputElement.files[0];

        const url = URL.createObjectURL(file);

        this.image.set({ file, url });
    }
}
