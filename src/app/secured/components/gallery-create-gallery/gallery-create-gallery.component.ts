import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { ApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";
import { GalleryService } from "../../../services/gallery.service";

@Component({
    selector: "app-gallery-create-gallery",
    imports: [ReactiveFormsModule],
    templateUrl: "./gallery-create-gallery.component.html",
    styleUrl: "./gallery-create-gallery.component.scss",
})
export class GalleryCreateGalleryComponent {
    submitButtonText = signal("Hinzufügen");
    submitButtonDisabled = signal(false);

    addGalleryForm = new FormGroup({
        titleControl: new FormControl(""),
        subtitleControl: new FormControl(""),
    });

    private galleryService = inject(GalleryService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const title = this.addGalleryForm.value.titleControl;
        const subtitle = this.addGalleryForm.value.subtitleControl;

        if (typeof title !== "string" || title.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib einen gültigen Titel ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (typeof subtitle !== "string" || subtitle.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib einen gültigen Untertitel ein.");

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

        const request = this.galleryService.addGallery(title, subtitle);

        request.subscribe({
            next: (response: ApiEndpointResponse): void => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Beim Erstellen der Galerie ist ein Fehler aufgetreten. " + response.message);

                    this.submitButtonDisabled.set(false);
                    this.submitButtonText.set("Hinzufügen");

                    return;
                }

                this.notificationService.success("Erfolg:", `Die Galerie "${title}" wurde erfolgreich erstellt.`);

                this.addGalleryForm.reset();

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");
            },
            error: (error: unknown): void => {
                console.error("Error while adding gallery:", error);
                this.notificationService.error("Fehler", "Beim Erstellen der Galerie ist ein Fehler aufgetreten. Bitte versuche es erneut.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");
            },
        });
    }
}
