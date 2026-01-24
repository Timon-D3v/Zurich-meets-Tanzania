import { Component, effect, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import { PopupMarkdownPreviewComponent } from "../popup-markdown-preview/popup-markdown-preview.component";

@Component({
    selector: "app-popup-text-input",
    imports: [ReactiveFormsModule, PopupMarkdownPreviewComponent],
    templateUrl: "./popup-text-input.component.html",
    styleUrl: "./popup-text-input.component.scss",
})
export class PopupTextInputComponent {
    title = input<string>("Text eingeben:");
    description = input<string>("Bitte gib den Text ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");
    label = input<string>("Text:");
    placeholder = input<string>("Text eingeben");
    value = input<string>("");
    submitButtonText = input<string>("Hinzufügen");

    resultOutput = output<string>();
    closeOutput = output<void>();

    addTextForm = new FormGroup({
        textControl: new FormControl(""),
    });

    previewOpen = signal<boolean>(false);
    previewContent = signal<string>("");

    private notificationService = inject(NotificationService);

    private _updateFormControl = effect(() => {
        this.addTextForm.setValue({ textControl: this.value() });
    });

    onSubmit(event: Event): void {
        event.preventDefault();

        const text = this.addTextForm.value.textControl;

        if (typeof text !== "string") {
            this.notificationService.error("Eingabefehler:", "Der eingegebene Text ist kein Text.");

            return;
        }

        this.resultOutput.emit(text);

        this.reset();
    }

    reset(): void {
        this.addTextForm.reset();
    }

    close(): void {
        this.closeOutput.emit();
    }

    showPreview(): void {
        this.previewOpen.set(true);

        const text = this.addTextForm.value.textControl;

        if (typeof text !== "string") {
            this.notificationService.error("Eingabefehler:", "Der eingegebene Text ist kein Text.");

            return;
        }

        this.previewContent.set(text);
    }

    closePreview(): void {
        this.previewOpen.set(false);
    }
}
