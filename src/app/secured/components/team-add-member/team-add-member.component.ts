import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
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
        jobControl: new FormControl(""),
        mottoControl: new FormControl(""),
    });

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const email = this.addTeamMemberForm.value.emailControl;
        const job = this.addTeamMemberForm.value.jobControl;
        const motivation = this.addTeamMemberForm.value.mottoControl;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (typeof job !== "string" || job.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Jobbezeichnung ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (typeof motivation !== "string" || motivation.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Motivationsbeschreibung ein.");

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

        const request = this.teamService.addMember(email, job, motivation);

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
