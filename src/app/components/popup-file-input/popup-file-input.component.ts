import { Component, effect, inject, input, output, signal } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { PUBLIC_CONFIG } from "../../../publicConfig";

@Component({
    selector: "app-popup-file-input",
    imports: [],
    templateUrl: "./popup-file-input.component.html",
    styleUrl: "./popup-file-input.component.scss",
})
export class PopupFileInputComponent {
    title = input<string>("Datei aussuchen:");
    description = input<string>("Bitte wähle eine Datei aus, die du hochladen möchtest.");
    label = input<string>("Dateiname:");
    accept = input<string>("*");
    submitButtonText = input<string>("Hinzufügen");

    resultOutput = output<File | null>();
    closeOutput = output<void>();

    file = signal<File | null>(null);

    private notificationService = inject(NotificationService);

    private _updateFormControl = effect(() => {
        this.file.set(new File([], ""));
    });

    onSubmit(event: Event): void {
        event.preventDefault();

        this.resultOutput.emit(this.file());
    }

    close(): void {
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

        this.file.set(file);
    }
}
