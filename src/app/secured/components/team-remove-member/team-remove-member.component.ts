import { Component, inject, PLATFORM_ID, signal, OnInit } from "@angular/core";
import { PUBLIC_CONFIG } from "../../../../publicConfig";
import { NotificationService } from "../../../services/notification.service";
import { ApiEndpointResponse, GetAllMembersOfAllTeamsApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";
import { TeamService } from "../../../services/team.service";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";

@Component({
    selector: "app-team-remove-member",
    imports: [PopupSelectionInputComponent],
    templateUrl: "./team-remove-member.component.html",
    styleUrl: "./team-remove-member.component.scss",
})
export class TeamRemoveMemberComponent implements OnInit {
    userEmailList = signal<string[]>([]);
    selectionOpen = signal<boolean>(true);

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.getAllTeamMembers();
    }

    getAllTeamMembers(): void {
        const request = this.teamService.getCurrentTeamMembers();

        request.subscribe({
            next: (response: GetAllMembersOfAllTeamsApiEndpointResponse) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der E-Mail-Adressen welche schon im Team sind ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.userEmailList.set(response.data.map((user) => user.email));
            },
            error: (error) => {
                console.error("Error while fetching user emails:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der E-Mail-Adressen welche schon im Team sind ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    removeTeamMember(email: string): void {
        if (typeof email !== "string" || email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            return;
        }

        this.closeSelection();

        const request = this.teamService.removeMember(email);

        request.subscribe({
            next: (response: ApiEndpointResponse): void => {
                if (response.error) {
                    this.notificationService.error("Fehler:", response.message);

                    return;
                }

                this.notificationService.success("Erfolg:", `Das Teammitglied mit der E-Mail "${email}" wurde erfolgreich entfernt.`);
            },
            error: (error: unknown): void => {
                console.error("Error while removing team member:", error);
                this.notificationService.error("Fehler:", "Beim Entfernen des Teammitglieds ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    openSelection(): void {
        this.selectionOpen.set(true);
    }

    closeSelection(): void {
        this.selectionOpen.set(false);
    }
}
