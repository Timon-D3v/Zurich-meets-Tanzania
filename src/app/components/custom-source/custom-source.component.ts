import { Component, inject, input } from "@angular/core";

@Component({
    selector: "app-custom-source",
    imports: [],
    templateUrl: "./custom-source.component.html",
    styleUrl: "./custom-source.component.scss",
})
export class CustomSourceComponent {
    content = input.required<string>();
    source = input.required<string>();
}
