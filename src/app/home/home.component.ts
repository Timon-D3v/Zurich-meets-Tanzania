import { Component, inject, OnInit } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { PublicEnvService } from "../services/public-env.service";
import { NewsComponent } from "../components/news/news.component";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-home",
    imports: [HeroComponent, NewsComponent, RouterLink],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
    HERO_IMAGE_URL = "https://api.timondev.com/cdn/zmt/7a121";
    readonly HERO_IMAGE_ALT = "Das Titelbild unserer Seite";

    readonly titleHtml = "Medizinische Hilfe<br>in Tanzania";
    readonly subtitle = "Wir sind ein Team von medizinischen Fachleuten aus den verschiedensten Berufsgruppen und Lehren.";

    readonly newsTitle = "Aktuell:";

    publicEnvService = inject(PublicEnvService);

    async ngOnInit(): Promise<void> {
        const env = await this.publicEnvService.getEnv();

        if (env === "dev") {
            this.HERO_IMAGE_URL = "https://api.timondev.com/cdn/dev/7a121";
        }
    }
}
