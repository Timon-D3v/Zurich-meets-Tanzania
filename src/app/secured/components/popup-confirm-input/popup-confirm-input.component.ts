import { Component, input, output } from "@angular/core";

@Component({
    selector: "app-popup-confirm-input",
    imports: [],
    templateUrl: "./popup-confirm-input.component.html",
    styleUrl: "./popup-confirm-input.component.scss",
})
export class PopupConfirmInputComponent {
    title = input<string>("Bestätigen:");
    description = input<string>("Möchtest du das wirklich tun?");
    confirmButtonText = input<string>("Bestätigen");
    cancelButtonText = input<string>("Abbrechen");

    resultOutput = output<boolean>();

    result(confirmed: boolean): void {
        this.resultOutput.emit(confirmed);
    }
}
