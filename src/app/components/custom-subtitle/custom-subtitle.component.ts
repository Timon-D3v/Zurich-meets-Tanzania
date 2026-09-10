import { Component, input } from "@angular/core";

@Component({
    selector: "app-custom-subtitle",
    imports: [],
    templateUrl: "./custom-subtitle.component.html",
    styleUrl: "./custom-subtitle.component.scss",
})
export class CustomSubtitleComponent {
    content = input.required<string>();
}
