import { Component, input } from "@angular/core";
import { CustomImageElement, CustomParagraphElement, CustomSubtitleElement } from "../../..";
import { markdownToHtml } from "../../../shared/utils";

@Component({
    selector: "app-custom-table",
    imports: [],
    templateUrl: "./custom-table.component.html",
    styleUrl: "./custom-table.component.scss",
})
export class CustomTableComponent {
    headers = input.required<Array<CustomSubtitleElement | CustomImageElement>>();
    rows = input.required<Array<Array<CustomParagraphElement | CustomImageElement>>>();
    source = input<undefined | { content: string; url: string }>(undefined);

    markdownToHtml = markdownToHtml;
}
