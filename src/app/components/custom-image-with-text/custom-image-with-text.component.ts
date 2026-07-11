import { Component, effect, input, signal } from "@angular/core";
import { markdownToHtml } from "../../../shared/utils";

@Component({
    selector: "app-custom-image-with-text",
    imports: [],
    templateUrl: "./custom-image-with-text.component.html",
    styleUrl: "./custom-image-with-text.component.scss",
})
export class CustomImageWithTextComponent {
    content = input.required<string>();
    imageUrl = input.required<string>();
    imageAlt = input<string>();
    sideOfImage = input<"left" | "right">("left");

    markdownToHtml = markdownToHtml;
}
