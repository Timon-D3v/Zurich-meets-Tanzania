import { Component, input, OnInit } from "@angular/core";

@Component({
    selector: "app-header-link",
    imports: [],
    templateUrl: "./header-link.component.html",
    styleUrl: "./header-link.component.scss",
})
export class HeaderLinkComponent implements OnInit {
    type = input<string>("");

    ngOnInit(): void {
        console.warn("Header link functionality is not implemented yet.");
    }
}
