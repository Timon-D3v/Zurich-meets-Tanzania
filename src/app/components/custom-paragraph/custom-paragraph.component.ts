import { Component, effect, input, signal } from "@angular/core";
import { markdownToHtml } from "../../../shared/utils";

@Component({
    selector: "app-custom-paragraph",
    imports: [],
    templateUrl: "./custom-paragraph.component.html",
    styleUrl: "./custom-paragraph.component.scss",
})
export class CustomParagraphComponent {
    content = input.required<string>();

    htmlContent = signal<string>("");

    private _updateContent = effect(() => {
        this.htmlContent.set(this.markdownToHtml(this.content()));
    });

    private markdownToHtml = markdownToHtml;
}
