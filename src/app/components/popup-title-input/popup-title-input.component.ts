import { Component, effect, inject, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";

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
    value = input<string>("");
    submitButtonText = input<string>("Hinzufügen");

    resultOutput = output<string>();
    closeOutput = output<void>();

    addTitleForm = new FormGroup({
        titleControl: new FormControl(""),
    });

    private notificationService = inject(NotificationService);

    private _updateFormControl = effect(() => {
        this.addTitleForm.setValue({ titleControl: this.value() });
    });

    onSubmit(event: Event): void {
        event.preventDefault();

        const title = this.addTitleForm.value.titleControl;

        if (typeof title !== "string") {
            this.notificationService.error("Eingabefehler:", "Der Titel ist kein Text.");

            return;
        }

        this.resultOutput.emit(title);

        this.reset();
    }

    reset(): void {
        this.addTitleForm.reset();
    }

    close(): void {
        this.reset();
        this.closeOutput.emit();
    }
}
