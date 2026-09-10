import { Component, input } from "@angular/core";

@Component({
    selector: "app-custom-multiple-buttons",
    imports: [],
    templateUrl: "./custom-multiple-buttons.component.html",
    styleUrl: "./custom-multiple-buttons.component.scss",
})
export class CustomMultipleButtonsComponent {
    buttons = input.required<
        {
            content: string;
            url: string;
            secondary: boolean;
        }[]
    >();
}
