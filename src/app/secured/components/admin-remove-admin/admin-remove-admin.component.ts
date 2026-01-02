import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { ApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";
import { AdminManagementService } from "../../../services/admin-management.service";

@Component({
    selector: "app-admin-remove-admin",
    imports: [ReactiveFormsModule],
    templateUrl: "./admin-remove-admin.component.html",
    styleUrl: "./admin-remove-admin.component.scss",
})
export class AdminRemoveAdminComponent {
    submitButtonText = signal("Entfernen");
    submitButtonDisabled = signal(false);

    removeAdminForm = new FormGroup({
        emailControl: new FormControl(""),
    });

    private adminManagementService = inject(AdminManagementService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const email = this.removeAdminForm.value.emailControl;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Entfernen");

            return;
        }

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Entfernen");

            return;
        }

        const request = this.adminManagementService.removeAdmin(email);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Entfernen");

                return;
            }

            this.notificationService.success("Erfolg:", `Die Admin-Rechte des Benutzers mit der E-Mail "${email}" wurden erfolgreich entzogen.`);

            this.removeAdminForm.reset();

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Entfernen");
        });
    }
}
