import { Component, effect, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: "app-popup-selection-input",
    imports: [ReactiveFormsModule],
    templateUrl: "./popup-selection-input.component.html",
    styleUrl: "./popup-selection-input.component.scss",
})
export class PopupSelectionInputComponent {
    title = input<string>("Blog bearbeiten");
    description = input<string>("Bitte gib den Titel des Blogs ein, den du bearbeiten möchtest.");
    label = input<string>("Titel:");
    placeholder = input<string>("Titel suchen");
    value = input<string>("");
    submitButtonText = input<string>("Bestätigen");
    selectionOptions = input.required<string[]>();

    currentInput = signal<string>("");
    selectedValue = signal<string | null>(null);
    filteredOptions = signal<string[]>([]);

    resultOutput = output<string>();
    closeOutput = output<void>();

    selectForm = new FormGroup({
        filterControl: new FormControl(""),
    });

    private notificationService = inject(NotificationService);

    private _updateFormControl = effect(() => {
        this.selectForm.setValue({ filterControl: this.value() });
    });

    private _updateCurrentInput = effect(() => {
        this.currentInput.set(this.selectForm.value.filterControl || "");
    });

    private _updateFilteredOptions = effect(() => {
        this.filteredOptions.set(this.selectionOptions().filter((option) => option.toLowerCase().includes(this.currentInput().toLowerCase())));
    });

    updateInput(): void {
        this.currentInput.set(this.selectForm.value.filterControl || "");
    }

    selectOption(option: string): void {
        this.selectedValue.set(option);
        this.selectForm.setValue({ filterControl: option });
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        const selection = this.selectedValue();

        if (selection === null) {
            this.notificationService.error("Keine Auswahl", "Bitte wähle eine Option aus der Liste aus.");

            return;
        }

        if (!this.selectionOptions().includes(selection)) {
            this.notificationService.error("Ungültige Auswahl", "Die ausgewählte Option ist nicht gültig.");

            return;
        }

        this.resultOutput.emit(selection);

        this.reset();
    }

    reset(): void {
        this.selectForm.reset();
        this.filteredOptions.set(this.selectionOptions());
        this.selectedValue.set(null);
        this.currentInput.set("");
    }

    close(): void {
        this.closeOutput.emit();
    }
}
