import { Component } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { DonationFormComponent } from "../components/donation-form/donation-form.component";

@Component({
    selector: "app-donate",
    imports: [HeroComponent, DonationFormComponent],
    templateUrl: "./donate.component.html",
    styleUrl: "./donate.component.scss",
})
export class DonateComponent {}
