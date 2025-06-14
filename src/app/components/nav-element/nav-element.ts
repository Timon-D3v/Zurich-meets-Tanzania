import { Component, input } from "@angular/core";
import { NavLink, NavLinkPicture } from "../../..";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-nav-element",
    imports: [RouterLink],
    templateUrl: "./nav-element.html",
    styleUrl: "./nav-element.scss",
})
export class NavElement {
    title = input<string>("");
    withPicture = input<boolean>(false);
    pictureArray = input<NavLinkPicture[]>([]);
    linkArray = input<NavLink[]>([]);
}
