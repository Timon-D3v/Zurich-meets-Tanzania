import { Component, inject, input, output, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { getRandomHexString } from "../../../shared/utils";
import { SelectOption } from "../../..";

@Component({
    selector: "app-edit-account-select-input",
    imports: [],
    templateUrl: "./edit-account-select-input.component.html",
    styleUrl: "./edit-account-select-input.component.scss",
})
export class EditAccountSelectInputComponent {
    options = input<SelectOption[]>([]);
    required = input(false);
    disabled = input(false);
    label = input.required<string>();
    iconSource = input.required<string>();
    iconAlt = input("");
    inputId = getRandomHexString(32);

    valueOutput = output<null | string | number | object>();

    private platformId = inject(PLATFORM_ID);

    streamValue(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const input = event.target;

        if (input === null) {
            throw new Error("No event target found.");
        }

        this.valueOutput.emit((input as HTMLInputElement).value);
    }
}
