import { Component, input } from "@angular/core";

@Component({
    selector: "app-custom-title",
    imports: [],
    templateUrl: "./custom-title.component.html",
    styleUrl: "./custom-title.component.scss",
})
export class CustomTitleComponent {
    content = input.required<string>();
}
