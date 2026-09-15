import { Component, inject, signal, OnInit } from "@angular/core";
import { UpdateExpandedUserInformationApiEndpointResponse, UpdateExpandedUserInformationRequestBody, ApiEndpointResponse } from "../../..";
import { EditAccountInputComponent } from "../edit-account-input/edit-account-input.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: "app-add-board-information",
    imports: [EditAccountInputComponent, ReactiveFormsModule],
    styleUrl: "./add-board-information.component.scss",
    templateUrl: "./add-board-information.component.html",
})
export class AddBoardInformationComponent implements OnInit {
    submitButtonDisabled = signal(false);
    submitButtonText = signal("Speichern");

    boardRole = signal<string>("");

    editBoardRoleForm = new FormGroup({
        roleControl: new FormControl(""),
    });

    private accountService = inject(AccountService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.accountService.getBoardRole().subscribe((response: ApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler", response.message);
                return;
            }

            this.boardRole.set(response.message);

            this.editBoardRoleForm.patchValue({
                roleControl: this.boardRole(),
            });
        });
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Speichern...");

        // Validate inputs
        const role = this.editBoardRoleForm.value.roleControl;

        console.log(role);

        if (typeof role !== "string") {
            return this.abortSubmit("Bitte gib eine gültige Vorstandsrolle ein.");
        }

        console.info("All inputs are valid. Proceeding with form submission...");

        // Check for a change
        if (this.boardRole() === role) {
            // No changes were made, so we can just re-enable the submit button and return early
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Speichern");
            this.notificationService.info("Keine Änderungen", "Es wurden keine Änderungen vorgenommen.");
            return;
        }

        // Send only the changed values to the backend
        const request = this.accountService.updateBoardRole(role);

        request.subscribe(async (response: ApiEndpointResponse): Promise<void> => {
            if (response.error) {
                this.notificationService.error("Fehler", response.message);
                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Speichern");
                return;
            }

            this.notificationService.success("Erfolg", "Alle Änderungen wurden erfolgreich gespeichert.");

            this.boardRole.set(role);

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Speichern");
        });
    }

    updateBoardRoleInput(event: string | number | object | null): void {
        if (typeof event === "string" && event.trim() !== "") {
            this.editBoardRoleForm.patchValue({
                roleControl: event,
            });
        } else if (typeof event === "string" && event.trim() === "") {
            // Set initial value
            this.editBoardRoleForm.patchValue({ roleControl: this.boardRole() });
        } else {
            console.warn(`Received non-string value for roleControl:`, event);
        }
    }

    abortSubmit(errorMessage: string): void {
        this.notificationService.error("Eingabefehler", errorMessage);

        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Speichern");
    }
}
