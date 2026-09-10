import { Component, inject, PLATFORM_ID, output, input } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { getRandomHexString } from "../../../shared/utils";

@Component({
    selector: "app-donation-amount-input",
    imports: [],
    templateUrl: "./donation-amount-input.component.html",
    styleUrl: "./donation-amount-input.component.scss",
})
export class DonationAmountInputComponent {
    placeholder = input<string>("___");
    currency = input<string>("CHF");
    maxLength = input<number>(7);
    disabled = input<boolean>(false);

    id = this.generateId();

    valueOutput = output<number>();

    private platformId = inject(PLATFORM_ID);

    onInput(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Not running in a browser environment. Skipping input size limitation.");
            return;
        }

        const inputElement = event.target as HTMLInputElement | null;

        if (!inputElement) {
            console.error("Input element not found.");
            return;
        }

        const value = inputElement.value;

        // Limit the number of digits to maxLength
        if (value.length > this.maxLength()) {
            inputElement.value = value.slice(0, this.maxLength());
        }

        this.valueOutput.emit(parseFloat(inputElement.value) || 0);
    }

    generateId(): string {
        return getRandomHexString(32);
    }
}
