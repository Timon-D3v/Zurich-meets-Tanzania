import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-logo",
    imports: [RouterLink],
    templateUrl: "./logo.component.html",
    styleUrl: "./logo.component.scss",
})
export class LogoComponent {}
