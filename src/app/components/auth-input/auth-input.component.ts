import { Component, computed, effect, inject, input, output, PLATFORM_ID, signal } from "@angular/core";
import { HTMLInputAutocompleteOptions, HTMLInputTypes } from "../../..";
import { isPlatformBrowser } from "@angular/common";
import { randomString } from "timonjs";

@Component({
    selector: "app-auth-input",
    imports: [],
    templateUrl: "./auth-input.component.html",
    styleUrl: "./auth-input.component.scss",
})
export class AuthInputComponent {
    constructor() {
        effect((): void => {
            // Updates 'inputType' when the input type 'type' arrives or changes
            this.inputType.set(this.type());
        });
    }

    type = input<HTMLInputTypes>("text");
    autocomplete = input<HTMLInputAutocompleteOptions>("on");
    required = input(false);
    disabled = input(false);
    placeholder = input("");
    label = input.required<string>();
    isPassword = input(false);
    iconSource = input.required<string>();
    iconAlt = input("");
    inputId = randomString(32);

    secondaryIconSrc = signal<"/svg/eye.svg" | "/svg/eye_closed.svg">("/svg/eye.svg");
    inputType = signal(this.type());

    valueOutput = output<null | string | number | object>();

    private platformId = inject(PLATFORM_ID);

    toggleForm(): void {
        if (this.inputType() === "password") {
            this.inputType.set("text");
            this.secondaryIconSrc.set("/svg/eye_closed.svg");
        } else {
            this.inputType.set("password");
            this.secondaryIconSrc.set("/svg/eye.svg");
        }
    }

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
