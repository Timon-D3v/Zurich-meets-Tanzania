import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { NewsComponent } from "../components/news/news.component";
import { RouterLink } from "@angular/router";
import { CalendarComponent } from "../components/calendar/calendar.component";
import { BlogPreviewComponent } from "../components/blog-preview/blog-preview.component";
import { TeamComponent } from "../components/team/team.component";
import { CalendarEvent, GetCalendarEventsApiEndpointResponse, GetBoardApiEndpointResponse, BoardUser } from "../..";
import { CalendarService } from "../services/calendar.service";
import { isPlatformBrowser } from "@angular/common";
import { NotificationService } from "../services/notification.service";
import { TeamService } from "../services/team.service";
import { LoadingComponent } from "../components/loading/loading.component";

@Component({
    selector: "app-home",
    imports: [HeroComponent, NewsComponent, RouterLink, CalendarComponent, BlogPreviewComponent, TeamComponent, LoadingComponent],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
    HERO_IMAGE_URL = "/redirects/heroImage";
    readonly HERO_IMAGE_ALT = "Das Titelbild unserer Seite";

    readonly titleHtml = "Medizinische Hilfe<br>in Tanzania";
    readonly subtitle = "Wir sind ein Team von medizinischen Fachleuten aus den verschiedensten Berufsgruppen und Lehren.";

    readonly newsTitle = "Aktuell:";

    private teamService = inject(TeamService);
    private calendarService = inject(CalendarService);
    private notificationService = inject(NotificationService);

    private platfromId = inject(PLATFORM_ID);

    numberOfEvents = signal(5);
    events = signal<CalendarEvent[]>([]);

    board = signal<BoardUser[]>([]);

    async ngOnInit(): Promise<void> {
        if (!isPlatformBrowser(this.platfromId)) {
            console.error("Cannot make API calls on the server side. Calendar events will not be loaded.");
            return;
        }

        this.getEvents();
        this.getBoard();
    }

    loadMoreEvents(event: Event): void {
        event.preventDefault();

        this.numberOfEvents.update((n) => n + 5);

        this.getEvents();
    }

    getEvents(): void {
        const request = this.calendarService.getLastXEvents(this.numberOfEvents());

        request.subscribe((response: GetCalendarEventsApiEndpointResponse) => {
            if (response.error || !response.data) {
                this.notificationService.error("Fehler:", "Die Kalenderdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");

                return;
            }

            this.events.set(response.data);
        });
    }

    getBoard(): void {
        const request = this.teamService.getBoard();

        request.subscribe((response: GetBoardApiEndpointResponse) => {
            if (response.error || !response.data) {
                this.notificationService.error("Fehler:", "Der Vorstand konnte nicht geladen werden. Bitte versuchen Sie es später erneut.");

                return;
            }

            this.board.set(response.data);
        });
    }
}
