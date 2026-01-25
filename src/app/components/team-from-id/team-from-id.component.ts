import { Component, effect, inject, input, PLATFORM_ID, signal } from "@angular/core";
import { TeamService } from "../../services/team.service";
import { NotificationService } from "../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { GetTeamApiEndpointResponse, Team } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { TeamComponent } from "../team/team.component";

@Component({
    selector: "app-team-from-id",
    imports: [TeamComponent],
    templateUrl: "./team-from-id.component.html",
    styleUrl: "./team-from-id.component.scss",
})
export class TeamFromIdComponent {
    id = input.required<number>();
    team = signal<Team>({
        id: -1,
        motto: "",
        text: "",
        picture: "",
        members: [],
        date: "",
    });

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    private _updateTeamWithId = effect(() => {
        this.update(this.id());
    });

    update(id: number): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot fetch when not in browser context.");

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

        const request = this.teamService.getTeam(id);

        request.subscribe((response: GetTeamApiEndpointResponse) => {
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

                return;
            }

            this.team.set(response.data);
        });
    }
}
