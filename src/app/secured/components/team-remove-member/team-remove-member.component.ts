import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { ApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";
import { TeamService } from "../../../services/team.service";

@Component({
    selector: "app-team-remove-member",
    imports: [ReactiveFormsModule],
    templateUrl: "./team-remove-member.component.html",
    styleUrl: "./team-remove-member.component.scss",
})
export class TeamRemoveMemberComponent {
    submitButtonText = signal("Entfernen");
    submitButtonDisabled = signal(false);

    removeTeamMemberForm = new FormGroup({
        emailControl: new FormControl(""),
    });

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const email = this.removeTeamMemberForm.value.emailControl;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Entfernen");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Entfernen");

            return;
        }

        const request = this.teamService.removeMember(email);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Entfernen");

                return;
            }

            this.notificationService.success("Erfolg:", `Das Teammitglied mit der E-Mail "${email}" wurde erfolgreich entfernt.`);

            this.removeTeamMemberForm.reset();

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Entfernen");
        });
    }
}
