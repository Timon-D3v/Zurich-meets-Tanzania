import { Component, input, OnInit } from "@angular/core";

@Component({
    selector: "app-header-link",
    imports: [],
    templateUrl: "./header-link.component.html",
    styleUrl: "./header-link.component.scss",
})
export class HeaderLinkComponent {
    type = input<string>("");
    linkIndex = input.required<number>();
}
