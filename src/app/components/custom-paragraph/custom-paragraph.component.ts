import { Component, input } from "@angular/core";

@Component({
    selector: "app-custom-paragraph",
    imports: [],
    templateUrl: "./custom-paragraph.component.html",
    styleUrl: "./custom-paragraph.component.scss",
})
export class CustomParagraphComponent {
    content = input.required<string>();
}
