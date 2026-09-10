import { Component, input } from "@angular/core";

@Component({
    selector: "app-custom-image",
    imports: [],
    templateUrl: "./custom-image.component.html",
    styleUrl: "./custom-image.component.scss",
})
export class CustomImageComponent {
    imageUrl = input.required<string>();
    imageAlt = input<string>();
}
