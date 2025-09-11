import { Component } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";

@Component({
    selector: "app-home",
    imports: [HeroComponent],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {
    HERO_IMAGE_URL = "https://ik.imagekit.io/zmt/assets/hero";
    HERO_IMAGE_ALT = "Das Titelbild unserer Seite";

    titleHtml = "Medizinische Hilfe<br>in Tanzania";
    subtitle = "Wir sind ein Team von medizinischen Fachleuten aus den verschiedensten Berufsgruppen und Lehren.";
}
