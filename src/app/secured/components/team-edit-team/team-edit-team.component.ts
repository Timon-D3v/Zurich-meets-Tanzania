import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TeamService } from "../../../services/team.service";
import { NotificationService } from "../../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponse, GetTeamApiEndpointResponse } from "../../../..";
import { PUBLIC_CONFIG } from "../../../../publicConfig";

@Component({
    imports: [ReactiveFormsModule],
    selector: "app-team-edit-team",
    styleUrl: "./team-edit-team.component.scss",
    templateUrl: "./team-edit-team.component.html",
})
export class TeamEditTeamComponent implements OnInit {
    submitButtonText = signal("Aktualisieren");
    submitButtonDisabled = signal(false);

    imageFile = signal<File | null>(null);
    imagePreview = signal<string>(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);

    editTeamForm = new FormGroup({
        mottoControl: new FormControl(""),
        descriptionControl: new FormControl(""),
    });

    private teamService = inject(TeamService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.loadCurrentTeam();
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const motto = this.editTeamForm.value.mottoControl;
        const description = this.editTeamForm.value.descriptionControl;

        if (typeof motto !== "string" || motto.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib ein gültiges Motto ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (typeof description !== "string") {
            // description is optional, so can be empty
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Beschreibung ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (this.imageFile() !== null && !(this.imageFile() instanceof File)) {
            // File can be null, but if it is not null, it must be a File
            // => Old images can be kept, so no new image is required
            this.notificationService.error("Eingabefehler:", "Bitte wähle ein gültiges Bild aus.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");

            return;
        }

        const request = this.teamService.updateTeam(motto, description, this.imageFile());

        request.subscribe({
            next: (response: ApiEndpointResponse): void => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Beim aktualisieren des Teams ist ein Fehler aufgetreten: " + response.message);

                    this.submitButtonDisabled.set(false);
                    this.submitButtonText.set("Aktualisieren");

                    return;
                }

                this.notificationService.success("Erfolg:", `Das aktuelle Team wurde erfolgreich aktualisiert.`);

                this.editTeamForm.reset();
                this.imageFile.set(null);
                this.imagePreview.set(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Aktualisieren");

                this.loadCurrentTeam();
            },
            error: (error: unknown): void => {
                console.error("Error while updating team:", error);
                this.notificationService.error("Fehler:", "Beim Aktualisieren des Teams ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Aktualisieren");
            },
        });
    }

    loadCurrentTeam(): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            return;
        }

        const request = this.teamService.getCurrentTeam();

        request.subscribe({
            next: (response: GetTeamApiEndpointResponse): void => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler:", "Beim laden des Teams ist ein Fehler aufgetreten: " + response.message);

                    return;
                }

                const team = response.data;

                this.editTeamForm.patchValue({
                    mottoControl: team.motto,
                    descriptionControl: team.text,
                });

                this.imagePreview.set(team.picture);
            },
            error: (error: unknown): void => {
                console.error("Error while loading current team:", error);
                this.notificationService.error("Fehler:", "Beim Laden des Teams ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
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
