import { Component, input } from "@angular/core";
import { NavLink, NavLinkPicture } from "../../..";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-nav-element",
    imports: [RouterLink],
    templateUrl: "./nav-element.component.html",
    styleUrl: "./nav-element.component.scss",
})
export class NavElementComponent {
    description = input<string>("");
    withPicture = input<boolean>(false);
    pictureArray = input<NavLinkPicture[]>([]);
    linkArray = input<NavLink[]>([]);
}
