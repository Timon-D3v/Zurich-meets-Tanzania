import { Component, input } from "@angular/core";
import { BlogMetadata } from "../../..";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-blog-preview-item",
    imports: [RouterLink],
    templateUrl: "./blog-preview-item.component.html",
    styleUrl: "./blog-preview-item.component.scss",
})
export class BlogPreviewItemComponent {
    metadata = input.required<BlogMetadata>();

    urlEncode(title: string): string {
        return encodeURIComponent(title);
    }
}
