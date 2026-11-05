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

    failedFetching = signal<boolean>(false);

    private newsService = inject(NewsService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.loadLastXNews(true);
    }

    /**
     * <Function>loadLastXNews</Function>
     * 
     * Fetches news items from the news service API to populate the news archive with recent article IDs.
     * Accepts initial boolean flag to differentiate between first page load (showing error message "Das News-Archiv konnte nicht geladen werden") versus subsequent loads ("Es konnten keine älteren News mehr geladen werden").
     * Makes asynchronous request via NewsService.getLastXNews() using loaded signal value as count parameter for how many news IDs to retrieve.
     * Handles API errors via next/then callbacks (error flag or null data) by showing error notifications and setting failedFetching signal to true, loading more news items later if user manually loads again.
     * On subscription errors: logs error to console and displays German error notification suggesting retry attempt, sets failedFetching flag indicating failure state in UI.
     * On successful fetch (data array returned): updates newsIds signal with received IDs array from API response, resets failedFetching flag to false for loading indicator reset.
     * Always completes without throwing errors ensuring graceful user interface transitions during loading states and error conditions throughout async operations.
     * 
     * @param {boolean} initial - Whether this is an initial page load call or subsequent manual reload attempt; defaults to false when called from external load click event handlers for pagination/scroll-to-load-more functionality.
     * @returns {void} Does not return a value; handles all async operations via Observable subscriptions ensuring complete lifecycle management without exceptions thrown during loading. Throws no errors.
     */
    loadLastXNews(initial: boolean = false): void {
        const request = this.newsService.getLastXNews(this.loaded());

        request.subscribe({
            next: (response: GetLastXNewsIdsApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler", (initial ? "Das News-Archiv konnte nicht geladen werden: " : "Es konnten keine älteren News mehr geladen werden: ") + response.message);

                    this.failedFetching.set(true);

                    return;
                }

                this.newsIds.set(response.data);
                this.failedFetching.set(false);
            },
            error: (error: unknown) => {
                console.error("Error while loading news archive:", error);
                this.notificationService.error("Fehler", "Das News-Archiv konnte nicht geladen werden. Bitte versuche es erneut.");

                this.failedFetching.set(true);
            },
        });
    }

    /**
     * <Function>load</Function>
     * 
     * Handles manual click event button for loading more news items to display in the news archive (pagination/scroll-to-load-more functionality).
     * Prevents default behavior and shows loading state by incrementing loaded signal value for pagination calculation (adds 5 items per load) then triggers loadLastXNews() again with new loaded count.
     * Used when user clicks button at bottom of list or reaches footer trigger point, appending next batch of news articles to current display area.
     * 
     * @param {Event} event - The click event triggered by button element in news archive pagination controls or manual reload button for fetching additional news items.
     * @returns {void} Does not return a value and completes async loading without errors after updating state signal and calling fetch handler method again. Throws no errors.
     */
    load(event: Event): void {
        event.preventDefault();

        this.loaded.update((value) => value + 5);

        this.loadLastXNews();
    }
}
