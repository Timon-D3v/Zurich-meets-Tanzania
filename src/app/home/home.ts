import { Component } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { HeroInformation } from "../..";

@Component({
    selector: "app-home",
    imports: [HeroComponent],
    templateUrl: "./home.html",
    styleUrl: "./home.scss",
})
export class Home {
    heroInformation: HeroInformation = {
        title: "Medizinische Hilfe<br>in Tanzania",
        subtitle: "Wir sind ein Team von medizinischen Fachleuten aus den verschiedensten Berufsgruppen und Lehren.",
        pictureAlt: "Das Titelbild unserer Seite",
        pictureUrl: "https://ik.imagekit.io/zmt/assets/hero",
    };
}
