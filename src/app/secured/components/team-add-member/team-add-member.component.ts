import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PUBLIC_CONFIG } from "../../../../publicConfig";
import { NotificationService } from "../../../services/notification.service";
import { ApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";
import { TeamService } from "../../../services/team.service";

@Component({
    selector: "app-team-add-member",
    imports: [ReactiveFormsModule],
    templateUrl: "./team-add-member.component.html",
    styleUrl: "./team-add-member.component.scss",
})
export class TeamAddMemberComponent {
    submitButtonText = signal("Hinzufügen");
    submitButtonDisabled = signal(false);

    addTeamMemberForm = new FormGroup({
        emailControl: new FormControl(""),
    });

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const email = this.addTeamMemberForm.value.emailControl;

        if (typeof email !== "string" || email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");
            return;
        }

        const request = this.teamService.addMember(email);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }

            this.notificationService.success("Erfolg:", `Das Teammitglied mit der E-Mail "${email}" wurde erfolgreich hinzugefügt.`);

            this.addTeamMemberForm.reset();

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");
        });
    }
}
