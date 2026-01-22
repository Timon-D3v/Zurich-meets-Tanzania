import { Component, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";

@Component({
    selector: "app-popup-title-input",
    imports: [ReactiveFormsModule],
    templateUrl: "./popup-title-input.component.html",
    styleUrl: "./popup-title-input.component.scss",
})
export class PopupTitleInputComponent {
    title = input<string>("Titel eingeben:");
    description = input<string>("Bitte gib den Titel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");
    label = input<string>("Titel:");
    placeholder = input<string>("Titel eingeben");

    resultOutput = output<string>();
    closeOutput = output<void>();

    submitButtonDisabled = signal(false);
    submitButtonText = signal("Hinzufügen");

    addTitleForm = new FormGroup({
        titleControl: new FormControl(""),
    });

    private notificationService = inject(NotificationService);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const title = this.addTitleForm.value.titleControl;

        if (typeof title !== "string") {
            this.notificationService.error("Eingabefehler:", "Der Titel ist kein Text.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        this.resultOutput.emit(title);

        this.reset();
    }

    reset(): void {
        this.addTitleForm.reset();
        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Hinzufügen");
    }

    close(): void {
        this.reset();
        this.closeOutput.emit();
    }
}
