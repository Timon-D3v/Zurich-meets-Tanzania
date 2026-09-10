import { Component, input, output } from "@angular/core";

@Component({
    selector: "app-popup-confirm",
    imports: [],
    templateUrl: "./popup-confirm.component.html",
    styleUrl: "./popup-confirm.component.scss",
})
export class PopupConfirmComponent {
    title = input<string>("Bestätigen:");
    description = input<string>("Möchtest du das wirklich tun?");
    confirmButtonText = input<string>("Bestätigen");
    cancelButtonText = input<string>("Abbrechen");

    equalOptions = input<boolean>(false);

    resultOutput = output<boolean>();

    result(confirmed: boolean): void {
        this.resultOutput.emit(confirmed);
    }
}
