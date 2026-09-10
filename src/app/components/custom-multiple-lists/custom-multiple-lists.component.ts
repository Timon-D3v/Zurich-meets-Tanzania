import { Component, input, signal } from "@angular/core";
import { markdownToHtml } from "../../../shared/utils";
import { CustomSubtitleComponent } from "../custom-subtitle/custom-subtitle.component";

@Component({
    selector: "app-custom-multiple-lists",
    imports: [CustomSubtitleComponent],
    templateUrl: "./custom-multiple-lists.component.html",
    styleUrl: "./custom-multiple-lists.component.scss",
})
export class CustomMultipleListsComponent {
    lists = input.required<
        {
            title: string;
            items: string[];
        }[]
    >();

    markdownToHtml = markdownToHtml;
}
