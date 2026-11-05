import { Component, inject, OnInit, signal, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GalleryService } from "../services/gallery.service";
import { NotificationService } from "../services/notification.service";
import { GetGalleryImagesApiEndpointResponse, Gallery } from "../..";
import { HeroComponent } from "../components/hero/hero.component";
import { GalleryImageComponent } from "../components/gallery-image/gallery-image.component";
import { GalleryImagePreviewComponent } from "../components/gallery-image-preview/gallery-image-preview.component";
import { LoadingComponent } from "../components/loading/loading.component";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-gallery",
    imports: [HeroComponent, GalleryImageComponent, GalleryImagePreviewComponent, LoadingComponent],
    templateUrl: "./gallery.component.html",
    styleUrl: "./gallery.component.scss",
})
export class GalleryComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    COLORS = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];

    heroImage = signal<string>(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);
    name = signal<string>("");
    gallery = signal<Gallery>({
        id: -1,
        title: "Laden...",
        subtitle: "",
        date: "2000-01-01T00:00:01.000Z",
        data: [],
    });

    currentOpenIndex = signal<number>(-1);

    failedFetching = signal<boolean>(false);

    private galleryService = inject(GalleryService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.route.paramMap.subscribe(async (params) => {
            const name = params.get("name");

            if (name === null) {
                this.router.navigate(["/"]);
                return;
            }

            this.name.set(decodeURIComponent(this.route.snapshot.params["name"]));

            this.getGallery();

            this.heroImage.set(await this.generateObjectUrl(this.COLORS));
        });
    }

    /**
     * <Function>getGallery</Function>
     * 
     * Fetches and loads gallery images from the API by name.
     * Makes an asynchronous request via GalleryService.getGalleryWithName() using the current name from the route params.
     * Handles both error cases (API error flag or null data payload) by showing error notifications, setting failedFetching flag to true, resetting hero image, and redirecting to home route (/).
     * On subscription errors: logs to console, displays error notification with retry advice, sets failedFetching state, performs navigation to root.
     * On successful fetch: updates gallery signal with either API response data or fallback values from current state, resets failedFetching flag to false indicating success.
     * Always completes without throwing; ensures proper UI state transitions and loading indicators throughout the async operation.
     * 
     * @param {void} No required parameters; invoked automatically when name property changes via route param subscription.
     * @returns {void} Does not return a value; handles all async operations via Observable subscriptions ensuring complete lifecycle management without exceptions. Throws no errors.
     */
    getGallery(): void {
        const request = this.galleryService.getGalleryWithName(this.name());

        request.subscribe({
            next: (response: GetGalleryImagesApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler:", "Diese Galerie konnte nicht geladen werden: " + response.message);

                    this.failedFetching.set(true);

                    this.router.navigate(["/"]);

                    return;
                }

                this.gallery.set(response.data || this.gallery());

                this.failedFetching.set(false);
            },
            error: (error: unknown) => {
                console.error("Error while loading gallery:", error);
                this.notificationService.error("Fehler:", "Diese Galerie konnte nicht geladen werden. Bitte versuche es erneut.");

                this.failedFetching.set(true);

                this.router.navigate(["/"]);
            },
        });
    }

    /**
     * <Function>generateObjectUrl</Function>
     * 
     * Generates a data URL from a colored canvas to use as temporary hero background image for the gallery.
     * Creates an in-memory HTML canvas element with specified dimensions (100x100 pixels) and fills it with a random color from provided array using Canvas API.
     * Converts canvas element to blob via toBlob() promise, validates that blob creation succeeded before creating object URL via URL.createObjectURL().
     * Throws errors when Canvas context is null, blob creation fails, or called on non-browser platform (server-side). Used for generating random colored backgrounds during gallery loading animations.
     * 
     * @param {string[]} colors - An array of CSS color strings to randomly select from (e.g., ["#ff0000", "#00ff00"]) to create diverse background appearances while gallery loads data.
     * @returns {Promise<string>} A data URL as a string that can be used directly in HTML img src or CSS background properties; returns object/URL string for canvas-based generated image with unique ID. Throws an error if called on non-browser platform or canvas/blob creation fails.
     */
    async generateObjectUrl(colors: string[]): Promise<string> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("generateObjectUrl can only be called in the browser");
        }

        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;

        const ctx = canvas.getContext("2d");

        const color = colors[Math.floor(Math.random() * colors.length)];

        if (ctx === null) {
            throw new Error("Canvas context is null");
        }

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 100, 100);

        const blob = await new Promise((resolve: (blob: Blob | null) => void) => canvas.toBlob(resolve, "image/png"));

        if (blob === null) {
            throw new Error("Failed to create blob from canvas");
        }

        return URL.createObjectURL(blob);
    }

    /**
     * <Function>openImagePreview</Function>
     * 
     * Opens a lightbox-style image preview overlay when user clicks on gallery images.
     * Prevents default mouse event behavior and stops propagation to avoid triggering parent element listeners or closing the modal immediately.
     * Updates currentOpenIndex signal with provided index from array of gallery images to show specific image in the preview overlay component.
     * Checks if clicked file is valid (non-null) before proceeding; if file is missing, shows error notification via NotificationService and returns early without displaying anything.
     * Logs console message with file information for debugging purposes during user interactions.
     * 
     * @param {Event} event - The click or other mouse event that triggered opening this image preview (prevented default and stopped propagation).
     * @param {number} index - The zero-based array index of the gallery image to display in the lightbox overlay; must be a valid numeric index within gallery.data array bounds.
     * @returns {void} Does not return a value after updating currentOpenIndex signal; displays error notification on first call if file is missing, no errors thrown under normal usage.
     */
    openImagePreview(event: Event, index: number): void {
        event.preventDefault();
        event.stopPropagation();

        this.currentOpenIndex.set(index);

        const file = this.gallery().data[index];

        if (!file) {
            this.notificationService.error("Fehler:", "Die Datei konnte nicht gefunden werden.");

            return;
        }

        console.log("Opening image preview for file:", file);
    }

    /**
     * <Function>closeImagePreview</Function>
     * 
     * Closes the image preview lightbox overlay by resetting the currentOpenIndex signal to -1 (closed state).
     * Removes any active preview overlay and returns the user to viewing the normal gallery layout without any image modal displayed.
     * Can be triggered manually via UI controls or programmatically when switching between galleries; always ensures clean exit from preview mode.
     * 
     * @param {void} No required parameters; closes preview by setting index signal back to closed state value (-1).
     * @returns {void} Does not return a value; performs immediate state update without side effects beyond signal mutation and no error throwing.
     */
    closeImagePreview(): void {
        this.currentOpenIndex.set(-1);
    }

    /**
     * <Function>showNextImage</Function>
     * 
     * Advances the image preview lightbox to show the next higher index from gallery data array cyclically (loops back to 0 after last item).
     * Validates whether current open index is -1 (closed) or already showing last item before advancing; if closed shows first image at index 0, otherwise increments by one.
     * Useful for creating slideshow navigation behavior inside lightbox overlay component; only affects currentOpenIndex signal state for controlling displayed preview.
     * 
     * @param {void} No required parameters; advances to next higher modulo-n index where n is gallery data array length or returns gracefully with valid bounds checking.
     * @returns {void} Does not return a value and updates signal immediately on state change without errors if called during preview viewing. Throws no errors.
     */
    showNextImage(): void {
        if (this.currentOpenIndex() === -1 || this.currentOpenIndex() === this.gallery().data.length - 1) {
            this.currentOpenIndex.set(0);
        } else {
            this.currentOpenIndex.update((currentIndex) => currentIndex + 1);
        }
    }

    /**
     * <Function>showPreviousImage</Function>
     * 
     * Moves the lightbox preview backward to show previous gallery items (wraps around from first image at index 0 to last item when going back past start).
     * Checks if currently closed or showing first image before wrapping behavior; ensures continuous navigation even when cycling between all available images in loop fashion.
     * Provides reverse-direction slideshow control for preview modals; updates currentOpenIndex signal accordingly with boundary conditions checked.
     * 
     * @param {void} No required parameters; decrements modulo-n index or wraps around to end if at start point; maintains circular iteration pattern through gallery images. Throws no errors.
     */
    showPreviousImage(): void {
        if (this.currentOpenIndex() === -1) {
            this.currentOpenIndex.set(0);
        } else if (this.currentOpenIndex() === 0) {
            this.currentOpenIndex.set(this.gallery().data.length - 1);
        } else {
            this.currentOpenIndex.update((currentIndex) => currentIndex - 1);
        }
    }

    /**
     * <Function>formatDate</Function>
     * 
     * Formats gallery image upload date strings into localized German (Swiss) locale form for display purposes.
     * Uses JavaScript Date constructor and toLocaleDateString() with de-CH locale settings (Germany/Switzerland cultural preferences) for consistent formatting across UI elements.
     * Returns human-readable string containing abbreviated weekday name, two-digit day from month, full month name in German, four-digit year, 12-hour or 24-hour clock hour, and minute digits. Useful for displaying image metadata chronologically ordered in list views.
     * 
     * @param {string} dateString - An ISO 8601 formatted date-time string (e.g., "2024-03-15T14:30:00Z" or similar) representing when the gallery image was uploaded/created or modified timestamp source value to format for display.
     * @returns {string} A German-stringified, localized date including abbreviated weekday, numeric day number, full month name (German), year, hour (with 12-hour formatting likely using locale specifics), and minutes in two-digit form; formatted as "ddd DD MMMM YYYY hh:mm" style string per Swiss-German conventions. Throws no errors even on invalid strings though results may show empty or fallback values.
     */
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("de-CH", {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }
}
