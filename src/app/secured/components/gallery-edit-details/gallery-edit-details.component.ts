import { Component, OnInit, signal, inject, effect } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";
import { PopupTitleInputComponent } from "../../../components/popup-title-input/popup-title-input.component";
import { GalleryService } from "../../../services/gallery.service";
import { ApiEndpointResponse } from "../../../..";

@Component({
    selector: "app-gallery-edit-details",
    imports: [PopupSelectionInputComponent, PopupTitleInputComponent],
    styleUrl: "./gallery-edit-details.component.scss",
    templateUrl: "./gallery-edit-details.component.html",
})
export class GalleryEditDetailsComponent implements OnInit {
    galleryTitleList = signal<string[]>([]);
    gallerySubtitleMap = signal<Map<string, string>>(new Map());
    selectionOpen = signal<boolean>(true);
    selectionSubmitButtonText = signal<"Bearbeiten" | "Laden...">("Bearbeiten");
    selectionSubmitButtonDisabled = signal<boolean>(false);
    titleInputOpen = signal<boolean>(false);
    subtitleInputOpen = signal<boolean>(false);
    oldTitle = signal<string>("");
    oldSubtitle = signal<string>("");
    newTitle = signal<string>("");

    private galleryService = inject(GalleryService);
    private notificationService = inject(NotificationService);

    private _setMatchingSubtitleForTitleEffect = effect(() => {
        const title = this.oldTitle();
        const subtitleMap = this.gallerySubtitleMap();

        if (title && subtitleMap.has(title)) {
            this.oldSubtitle.set(subtitleMap.get(title) || "");
        } else {
            this.oldSubtitle.set("");
        }
    });

    ngOnInit(): void {
        this.getAllGalleryTitlesAndSubtitles();
    }

    getAllGalleryTitlesAndSubtitles(): void {
        const request = this.galleryService.getAllGalleryTitlesAndSubtitles();

        request.subscribe({
            next: (response) => {
                if (response.error || response.data === null || response.data.data === null) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der Galerie-Titel ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                const subtitleMap = new Map<string, string>();
                const titles = [];

                for (const gallery of response.data.data as { title: string; subtitle: string }[]) {
                    subtitleMap.set(gallery.title, gallery.subtitle);
                    titles.push(gallery.title);
                }

                this.gallerySubtitleMap.set(subtitleMap);
                this.galleryTitleList.set(titles);
            },
            error: (error) => {
                console.error("Error while fetching gallery titles:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der Galerie-Titel ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    editNewTitle(galleryTitle: string): void {
        this.selectionSubmitButtonText.set("Laden...");
        this.selectionSubmitButtonDisabled.set(true);

        this.oldTitle.set(galleryTitle);

        this.closeSelection();
        this.openTitleInput();
    }

    editNewSubtitle(newTitle: string): void {
        this.newTitle.set(newTitle);

        this.closeTitleInput();
        this.openSubtitleInput();
    }

    updateGallery(newSubtitle: string): void {
        const oldTitle = this.oldTitle();
        const newTitle = this.newTitle();

        if (!oldTitle || oldTitle.trim() === "") {
            this.notificationService.error("Fehler:", "Es wurde keine Galerie zum Bearbeiten ausgewählt.");
            this.closeSubtitleInput();
            return;
        }

        if (!newTitle || newTitle.trim() === "") {
            this.notificationService.error("Fehler:", "Der neue Titel darf nicht leer sein.");
            this.closeSubtitleInput();
            return;
        }

        if (!newSubtitle || newSubtitle.trim() === "") {
            this.notificationService.error("Fehler:", "Der neue Untertitel darf nicht leer sein.");
            this.closeSubtitleInput();
            return;
        }

        const request = this.galleryService.updateGalleryDetails(oldTitle, newTitle, newSubtitle);

        this.closeSubtitleInput();

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Aktualisieren der Galerie ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", `Die Galerie "${oldTitle}" wurde erfolgreich aktualisiert. Neuer Titel: "${newTitle}", Neuer Untertitel: "${newSubtitle}"`);
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

    openTitleInput(): void {
        this.titleInputOpen.set(true);
    }

    closeTitleInput(): void {
        this.titleInputOpen.set(false);
    }

    openSubtitleInput(): void {
        this.subtitleInputOpen.set(true);
    }

    closeSubtitleInput(): void {
        this.subtitleInputOpen.set(false);
    }
}
