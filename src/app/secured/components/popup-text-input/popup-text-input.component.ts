import { Component, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";

@Component({
    selector: "app-popup-text-input",
    imports: [ReactiveFormsModule],
    templateUrl: "./popup-text-input.component.html",
    styleUrl: "./popup-text-input.component.scss",
})
export class PopupTextInputComponent {
    title = input<string>("Text eingeben:");
    description = input<string>("Bitte gib den Text ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");
    label = input<string>("Text:");
    placeholder = input<string>("Text eingeben");

    resultOutput = output<string>();
    closeOutput = output<void>();

    submitButtonDisabled = signal(false);
    submitButtonText = signal("Hinzufügen");

    addTextForm = new FormGroup({
        textControl: new FormControl(""),
    });

    private notificationService = inject(NotificationService);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const text = this.addTextForm.value.textControl;

        if (typeof text !== "string") {
            this.notificationService.error("Eingabefehler:", "Der eingegebene Text ist kein Text.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        this.resultOutput.emit(text);

        this.reset();
    }

    reset(): void {
        this.addTextForm.reset();
        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Hinzufügen");
    }

    close(): void {
        this.reset();
        this.closeOutput.emit();
    }}
