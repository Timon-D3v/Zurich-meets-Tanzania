import { Component, inject, OnInit, signal } from "@angular/core";
import { GetLastXNewsIdsApiEndpointResponse, News } from "../..";
import { NewsService } from "../services/news.service";
import { NotificationService } from "../services/notification.service";
import { NewsComponent } from "../components/news/news.component";
import { LoadingComponent } from "../components/loading/loading.component";

@Component({
    selector: "app-news-archive",
    imports: [NewsComponent, LoadingComponent],
    templateUrl: "./news-archive.component.html",
    styleUrl: "./news-archive.component.scss",
})
export class NewsArchiveComponent implements OnInit {
    loaded = signal<number>(5);

    newsIds = signal<number[]>([]);

    private newsService = inject(NewsService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        const initialRequest = this.newsService.getLastXNews(this.loaded());

        initialRequest.subscribe((response: GetLastXNewsIdsApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler", "Das News-Archiv konnte nicht geladen werden: " + response.message);

                return;
            }

            this.newsIds.set(response.data);
        });
    }

    load(event: Event): void {
        event.preventDefault();

        this.loaded.update((value) => value + 5);

        const request = this.newsService.getLastXNews(this.loaded());

        request.subscribe((response: GetLastXNewsIdsApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler", "Es konnten keine älteren News mehr geladen werden: " + response.message);

                return;
            }

            this.newsIds.set(response.data);
        });
    }
}
