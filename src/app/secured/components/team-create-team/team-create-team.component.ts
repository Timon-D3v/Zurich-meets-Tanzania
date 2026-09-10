import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TeamService } from "../../../services/team.service";
import { NotificationService } from "../../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponse } from "../../../..";
import { PUBLIC_CONFIG } from "../../../../publicConfig";

@Component({
    selector: "app-team-create-team",
    imports: [ReactiveFormsModule],
    templateUrl: "./team-create-team.component.html",
    styleUrl: "./team-create-team.component.scss",
})
export class TeamCreateTeamComponent {
    submitButtonText = signal("Erstellen");
    submitButtonDisabled = signal(false);

    imageFile = signal<File | null>(null);
    imagePreview = signal<string>(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);

    createTeamForm = new FormGroup({
        mottoControl: new FormControl(""),
        descriptionControl: new FormControl(""),
    });

    private teamManagementService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const motto = this.createTeamForm.value.mottoControl;
        const description = this.createTeamForm.value.descriptionControl;

        if (typeof motto !== "string" || motto.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib ein gültiges Motto ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (typeof description !== "string") {
            // description is optional, so can be empty
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Beschreibung ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (this.imageFile() === null || !(this.imageFile() instanceof File)) {
            this.notificationService.error("Eingabefehler:", "Bitte wähle ein gültiges Bild aus.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        const request = this.teamManagementService.createTeam(motto, description, this.imageFile() as File);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Erstellen");

                return;
            }

            this.notificationService.success("Erfolg:", `Das Team mit dem Motto "${motto}" wurde erfolgreich erstellt.`);

            this.createTeamForm.reset();
            this.imageFile.set(null);
            this.imagePreview.set(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");
        });
    }

    onChange(event: Event): void {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }

        const files = event.target.files;

        if (!files || files.length === 0) {
            this.imageFile.set(null);
            this.imagePreview.set(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);

            return;
        }

        const url = URL.createObjectURL(files[0]);

        this.imageFile.set(files[0]);
        this.imagePreview.set(url);
    }
}
