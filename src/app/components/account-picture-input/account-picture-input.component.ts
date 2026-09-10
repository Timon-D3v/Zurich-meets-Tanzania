import { isPlatformBrowser } from "@angular/common";
import { Component, inject, input, output, PLATFORM_ID } from "@angular/core";

@Component({
    selector: "app-account-picture-input",
    imports: [],
    templateUrl: "./account-picture-input.component.html",
    styleUrl: "./account-picture-input.component.scss",
})
export class AccountPictureInputComponent {
    imageUrl = input.required<string>();
    imageAlt = input<string>("");

    private platformId = inject(PLATFORM_ID);

    valueOutput = output<Blob | null>();

    streamValue(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const input = event.target;

        if (input === null) {
            throw new Error("No event target found.");
        }

        this.valueOutput.emit((input as HTMLInputElement).files?.[0] ?? null);
    }
}
