import { Component, input, output } from "@angular/core";

@Component({
    selector: "app-popup-alert",
    imports: [],
    templateUrl: "./popup-alert.component.html",
    styleUrl: "./popup-alert.component.scss",
})
export class PopupAlertComponent {
    title = input<string>("Achtung:");
    description = input<string>("Etwas ist passiert, das deine Aufmerksamkeit erfordert.");
    submitButtonText = input<string>("Verstanden");

    closeOutput = output<void>();

    onSubmit(event: Event): void {
        event.preventDefault();

        this.close();
    }

    close(): void {
        this.closeOutput.emit();
    }
}
