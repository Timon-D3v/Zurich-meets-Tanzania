import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { TeamComponent } from "../team/team.component";
import { GetBoardApiEndpointResponse, BoardUser } from "../../..";
import { isPlatformBrowser } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { TeamService } from "../../services/team.service";
import { LoadingComponent } from "../loading/loading.component";

@Component({
    selector: "app-board",
    imports: [LoadingComponent, TeamComponent],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.scss",
})
export class BoardComponent implements OnInit {
    board = signal<BoardUser[]>([]);

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platfromId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platfromId)) {
            console.error("Cannot make API calls on the server side. Calendar events will not be loaded.");
            return;
        }

        this.getBoard();
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
