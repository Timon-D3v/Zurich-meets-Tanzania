import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { ApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";
import { AdminManagementService } from "../../../services/admin-management.service";

@Component({
    selector: "app-admin-add-admin",
    imports: [ReactiveFormsModule],
    templateUrl: "./admin-add-admin.component.html",
    styleUrl: "./admin-add-admin.component.scss",
})
export class AdminAddAdminComponent {
    submitButtonText = signal("Hinzufügen");
    submitButtonDisabled = signal(false);

    addAdminForm = new FormGroup({
        emailControl: new FormControl(""),
    });

    private adminManagementService = inject(AdminManagementService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const email = this.addAdminForm.value.emailControl;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

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

        const request = this.adminManagementService.addAdmin(email);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error && response.message === "Der Benutzer ist bereits ein Admin.") {
                this.notificationService.info("Info:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            } else if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }

            this.notificationService.success("Erfolg:", `Der Benutzer mit der E-Mail "${email}" wurde erfolgreich zum Admin ernannt.`);

            this.addAdminForm.reset();

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");
        });
    }
}
