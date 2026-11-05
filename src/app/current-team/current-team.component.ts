import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { TeamService } from "../services/team.service";
import { GetTeamApiEndpointResponse, AssembledTeam } from "../..";
import { NotificationService } from "../services/notification.service";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { LoadingComponent } from "../components/loading/loading.component";
import { HeroComponent } from "../components/hero/hero.component";
import { isPlatformBrowser } from "@angular/common";
import { TeamComponent } from "../components/team/team.component";

@Component({
    selector: "app-current-team",
    imports: [LoadingComponent, HeroComponent, TeamComponent],
    templateUrl: "./current-team.component.html",
    styleUrl: "./current-team.component.scss",
})
export class CurrentTeamComponent implements OnInit {
    team = signal<AssembledTeam>({
        id: -1,
        motto: "",
        text: "",
        picture: "",
        members: [],
        date: "",
    });

    failedFetching = signal<boolean>(false);

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot fetch when not in browser context.");

            this.failedFetching.set(true);

            this.team.set({
                id: -2,
                motto: "Fehler beim Laden des Teams",
                text: "",
                picture: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                members: [],
                date: "",
            });

            return;
        }

        this.loadCurrentTeam();
    }

    /**
     * <Function>loadCurrentTeam</Function>
     * 
     * Fetches and loads the current team data from the API.
     * Makes an asynchronous request via TeamService.getCurrentTeam() to retrieve the complete team information including members, motto, text content, picture URL, date, and ID.
     * Checks browser context in ngOnInit(); if not valid, sets failure state with error message and fallback values (id: -2), preventing server-side fetch attempts on Node.js environments.
     * Handles API responses: displays success notification or empty result handling; invalid data (error flag set or null payload) triggers error flow by showing error message, setting failedFetching signal to true, updating team signal with fallback object displaying error text and falling picture.
     * Handles subscription errors via error callback: logs errors to console, shows error notification in German explaining load failure and retry advice, updates team state with error placeholder values, marks fetching as failed.
     * On all success cases: resets failedFetching flag to false to indicate successful data loading. Always avoids throwing and ensures proper UI state transitions for user experience.
     * 
     * @param {void} No required parameters; invoked automatically during component initialization or via external trigger.
     * @returns {void} Does not return a value; handles all async operations via Observable subscriptions ensuring complete lifecycle management without exceptions. Throws no errors.
     */
    loadCurrentTeam(): void {
        const request = this.teamService.getCurrentTeam();

        request.subscribe({
            next: (response: GetTeamApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler beim Laden des Teams:", response.message);

                    this.team.set({
                        id: -2,
                        motto: "Fehler beim Laden des Teams",
                        text: "",
                        picture: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                        members: [],
                        date: "",
                    });

                    this.failedFetching.set(true);

                    return;
                }

                this.team.set(response.data);

                this.failedFetching.set(false);
            },
            error: (error: unknown) => {
                console.error("Error while loading current team:", error);
                this.notificationService.error("Fehler beim Laden des Teams:", "Das aktuelle Team konnte nicht geladen werden. Bitte versuche es erneut.");

                this.team.set({
                    id: -2,
                    motto: "Fehler beim Laden des Teams",
                    text: "",
                    picture: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                    members: [],
                    date: "",
                });

                this.failedFetching.set(true);
            },
        });
    }
}
