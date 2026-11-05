import { Component } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { NewsComponent } from "../components/news/news.component";
import { RouterLink } from "@angular/router";
import { CalendarComponent } from "../components/calendar/calendar.component";
import { BlogPreviewComponent } from "../components/blog-preview/blog-preview.component";
import { BoardComponent } from "../components/board/board.component";
import { CustomMultipleButtonsComponent } from "../components/custom-multiple-buttons/custom-multiple-buttons.component";

/**
 * @component <Home>home</Home>
 * 
 * The home component serves as the main landing page with hero image, news updates, calendar events, blog preview, board member information, and action buttons for user engagement.
 * Displays organizational mission in Tanzania alongside team composition descriptions, current news items section headers, navigation routing links via RouterLink directive.
 */
@Component({
    selector: "app-home",
    imports: [HeroComponent, NewsComponent, RouterLink, CalendarComponent, BlogPreviewComponent, BoardComponent, CustomMultipleButtonsComponent],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {
    readonly HERO_IMAGE_URL = "/redirects/heroImage";
    readonly HERO_IMAGE_ALT = "Das Titelbild unserer Seite";

    readonly titleHtml = "Medizinische Hilfe<br>in Tanzania";
    readonly subtitle = "Wir sind ein Team von medizinischen Fachleuten aus den verschiedensten Berufsgruppen und Lehren.";

    readonly newsTitle = "Aktuell:";
}
