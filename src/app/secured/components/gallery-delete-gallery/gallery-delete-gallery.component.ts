import { Component, OnInit, signal, inject } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";
import { GalleryService } from "../../../services/gallery.service";

@Component({
    selector: "app-gallery-delete-gallery",
    imports: [PopupSelectionInputComponent],
    templateUrl: "./gallery-delete-gallery.component.html",
    styleUrl: "./gallery-delete-gallery.component.scss",
})
export class GalleryDeleteGalleryComponent implements OnInit {
    galleryTitleList = signal<string[]>([]);
    selectionOpen = signal<boolean>(false);

    private galleryService = inject(GalleryService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.getAllGalleryTitles();
    }

    getAllGalleryTitles(): void {
        const request = this.galleryService.getAllGalleryTitles();

        request.subscribe({
            next: (response) => {
                if (response.error || response.data === null || response.data.data === null) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der Galerie-Titel ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.galleryTitleList.set(response.data.data.map((gallery: { title: string }) => gallery.title));
            },
            error: (error) => {
                console.error("Error while fetching gallery titles:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der Galerie-Titel ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    removeGallery(title: string): void {
        this.closeSelection();

        const request = this.galleryService.removeGallery(title);

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Entfernen der Galerie ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", "Galerie erfolgreich entfernt.");
                this.getAllGalleryTitles();
            },
            error: (error) => {
                console.error("Error while removing gallery:", error);
                this.notificationService.error("Fehler:", "Beim Entfernen der Galerie ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
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
