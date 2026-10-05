import { Component, OnInit, signal, inject } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";
import { GalleryService } from "../../../services/gallery.service";
import { PopupMultipleImagesInputComponent } from "../../../components/popup-multiple-images-input/popup-multiple-images-input.component";
import { GetGalleryImagesApiEndpointResponse, ApiEndpointResponse } from "../../../..";

@Component({
    imports: [PopupSelectionInputComponent, PopupMultipleImagesInputComponent],
    selector: "app-gallery-edit-images",
    styleUrl: "./gallery-edit-images.component.scss",
    templateUrl: "./gallery-edit-images.component.html",
})
export class GalleryEditImagesComponent implements OnInit {
    galleryTitleList = signal<string[]>([]);
    imagesArray = signal<{ imageUrl: string; imageAlt: string }[]>([]);
    selectionOpen = signal<boolean>(true);
    selectionSubmitButtonText = signal<"Bearbeiten" | "Laden...">("Bearbeiten");
    selectionSubmitButtonDisabled = signal<boolean>(false);
    imagePopupOpen = signal<boolean>(false);
    galleryToEdit = signal<string | null>(null);

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

    loadGallery(galleryTitle: string): void {
        this.selectionSubmitButtonText.set("Laden...");
        this.selectionSubmitButtonDisabled.set(true);

        this.galleryToEdit.set(galleryTitle);

        console.info("Loading gallery:", galleryTitle);

        const request = this.galleryService.getGalleryWithName(galleryTitle);

        request.subscribe({
            next: (response: GetGalleryImagesApiEndpointResponse): void => {
                if (response.error || response.data === null) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der Galerie ist ein Fehler aufgetreten: " + response.message);
                    this.selectionSubmitButtonText.set("Bearbeiten");
                    this.selectionSubmitButtonDisabled.set(false);
                    return;
                }

                const galleryData = response.data;

                this.imagesArray.set(
                    galleryData.data.map((image) => {
                        return {
                            imageUrl: image.url,
                            imageAlt: image.uuid,
                        };
                    }),
                );

                this.closeSelection();
                this.openImagePopup();

                this.selectionSubmitButtonText.set("Bearbeiten");
                this.selectionSubmitButtonDisabled.set(false);
            },
            error: (error) => {
                console.error("Error while fetching gallery:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der Galerie ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
                this.selectionSubmitButtonText.set("Bearbeiten");
                this.selectionSubmitButtonDisabled.set(false);
            },
        });

        this.closeSelection();
        this.openImagePopup();
    }

    updateGallery(files: { file: File; url: string }[]): void {
        const galleryTitle = this.galleryToEdit();

        if (!galleryTitle) {
            this.notificationService.error("Fehler:", "Es wurde keine Galerie zum Bearbeiten ausgewählt.");
            this.closeImagePopup();
            return;
        }

        const request = this.galleryService.updateGalleryImages(galleryTitle, files);

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Aktualisieren der Galerie ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", `Die Galerie "${galleryTitle}" wurde erfolgreich aktualisiert.`);
                this.closeImagePopup();
            },
            error: (error) => {
                console.error("Error while updating gallery:", error);
                this.notificationService.error("Fehler:", "Beim Aktualisieren der Galerie ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    openSelection(): void {
        this.selectionOpen.set(true);
    }

    closeSelection(): void {
        this.selectionOpen.set(false);
    }

    openImagePopup(): void {
        this.imagePopupOpen.set(true);
    }

    closeImagePopup(): void {
        this.imagePopupOpen.set(false);
    }
}
