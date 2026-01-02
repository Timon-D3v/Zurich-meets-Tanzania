import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AdminManagementService } from "../../../services/admin-management.service";
import { NotificationService } from "../../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiEndpointResponse } from "../../../..";

@Component({
    selector: "app-admin-create-account",
    imports: [ReactiveFormsModule],
    templateUrl: "./admin-create-account.component.html",
    styleUrl: "./admin-create-account.component.scss",
})
export class AdminCreateAccountComponent {
    submitButtonText = signal("Erstellen");
    submitButtonDisabled = signal(false);

    createUserForm = new FormGroup({
        emailControl: new FormControl(""),
        firstNameControl: new FormControl(""),
        lastNameControl: new FormControl(""),
        addressControl: new FormControl(""),
    });

    private adminManagementService = inject(AdminManagementService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const email = this.createUserForm.value.emailControl;
        const firstName = this.createUserForm.value.firstNameControl;
        const lastName = this.createUserForm.value.lastNameControl;
        const address = this.createUserForm.value.addressControl;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige E-Mail-Adresse ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (typeof firstName !== "string" || firstName.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib einen gültigen Vornamen ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (typeof lastName !== "string" || lastName.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib einen gültigen Nachnamen ein.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");

            return;
        }

        if (typeof address !== "string" || address.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Adresse ein.");

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

        const request = this.adminManagementService.createUser(email, firstName, lastName, address);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Erstellen");

                return;
            }

            this.notificationService.success("Erfolg:", `Der Benutzer mit der E-Mail "${email}" wurde erfolgreich erstellt. Das Passwort wurde an diese E-Mail-Adresse gesendet.`);

            this.createUserForm.reset();

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Erstellen");
        });
    }
}
