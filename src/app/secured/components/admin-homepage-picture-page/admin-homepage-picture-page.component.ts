import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AdminManagementService } from "../../../services/admin-management.service";
import { NotificationService } from "../../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponse } from "../../../..";
import { PublicEnvService } from "../../../services/public-env.service";

@Component({
    selector: "app-admin-homepage-picture-page",
    imports: [ReactiveFormsModule],
    templateUrl: "./admin-homepage-picture-page.component.html",
    styleUrl: "./admin-homepage-picture-page.component.scss",
})
export class AdminHomepagePicturePageComponent implements OnInit {
    private defaultImagePreview = "https://api.timondev.com/cdn/zmt/7a121";
    imagePreview = signal<string>(this.defaultImagePreview);

    submitButtonText = signal<string>("Aktualisieren");
    submitButtonDisabled = signal<boolean>(false);

    fileInput = signal<Blob | null>(null);

    private adminManagementService = inject(AdminManagementService);
    private notificationService = inject(NotificationService);
    private publicEnvService = inject(PublicEnvService);

    private platformId = inject(PLATFORM_ID);

    async ngOnInit(): Promise<void> {
        const env = await this.publicEnvService.getEnv();

        if (env === "dev") {
            this.imagePreview.set("https://api.timondev.com/cdn/dev/7a121");
        }
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const blob = this.fileInput();

        if (!(blob instanceof Blob)) {
            this.notificationService.error("Eingabefehler:", "Bitte lade eine gültige Bilddatei hoch.");

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

        const request = this.adminManagementService.changeHomepagePicture(blob);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Aktualisieren");

                return;
            }

            this.notificationService.success("Erfolg:", `Das Homepage-Bild wurde erfolgreich aktualisiert.`);

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Aktualisieren");
        });
    }

    streamValue(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const input = event.target;

        if (input === null) {
            throw new Error("No event target found.");
        }

        const file = (input as HTMLInputElement).files?.[0] ?? null;

        if (file === null) {
            this.imagePreview.set(this.defaultImagePreview);
            this.fileInput.set(null);
            return;
        }

        const url = URL.createObjectURL(file);

        this.imagePreview.set(url);
        this.fileInput.set(file);
    }
}
