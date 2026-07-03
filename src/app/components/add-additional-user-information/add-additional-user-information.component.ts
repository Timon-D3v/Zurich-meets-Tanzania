import { Component, inject, signal,OnInit } from "@angular/core";
import { UpdateExpandedUserInformationApiEndpointResponse, UpdateExpandedUserInformationRequestBody, GetExpandedUserInformationApiEndpointResponse } from "../../..";
import { EditAccountInputComponent } from "../edit-account-input/edit-account-input.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: "app-add-additional-user-information",
    imports: [EditAccountInputComponent, ReactiveFormsModule],
    templateUrl: "./add-additional-user-information.component.html",
    styleUrl: "./add-additional-user-information.component.scss",
})
export class AddAdditionalUserInformationComponent implements OnInit {
    submitButtonDisabled = signal(false);
    submitButtonText = signal("Speichern");

    expandedUser = signal<{motive: string; profession: string; role: string; secondaryPicture: string; }>({
        motive: "",
        profession: "",
        role: "",
        secondaryPicture: "",
    })

    editProfileForm = new FormGroup({
        professionControl: new FormControl(""),
        motiveControl: new FormControl(""),
    });

    private accountService = inject(AccountService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.accountService.getExpandedUserInformation().subscribe((response: GetExpandedUserInformationApiEndpointResponse) => {
            if (response.error || !response.data) {
                this.notificationService.error("Fehler", response.message);
                return;
            }

            this.expandedUser.set({
                motive: response.data.motive || "",
                profession: response.data.profession || "",
                role: response.data.role || "",
                secondaryPicture: response.data.secondaryPicture || "",
            });

            this.editProfileForm.patchValue({
                professionControl: this.expandedUser().profession,
                motiveControl: this.expandedUser().motive,
            });
        });
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Speichern...");

        // Validate inputs
        const profession = this.editProfileForm.value.professionControl;
        const motive = this.editProfileForm.value.motiveControl;

        console.log(profession, motive);

        if (!profession || typeof profession !== "string" || profession.trim() === "") {
            return this.abortSubmit("Bitte gib eine gültige Berufsinformation ein.");
        }

        if (!motive || typeof motive !== "string" || motive.trim() === "") {
            return this.abortSubmit("Bitte gib eine gültige Motivation ein.");
        }

        console.info("All inputs are valid. Proceeding with form submission...");

        const updatedUserData = {
            profession: profession.trim(),
            motive: motive.trim(),
            secondaryPicture: null, // Not implemented yet
            role: null, // Not implemented yet
        };

        // Look for values that changed
        const requestBody: UpdateExpandedUserInformationRequestBody = {
            profession: updatedUserData.profession !== this.expandedUser().profession ? updatedUserData.profession : null,
            motive: updatedUserData.motive !== this.expandedUser().motive ? updatedUserData.motive : null,
            secondaryPicture: updatedUserData.secondaryPicture !== this.expandedUser().secondaryPicture ? updatedUserData.secondaryPicture : null,
            role: updatedUserData.role !== this.expandedUser().role ? updatedUserData.role : null,
        };


        if (Object.values(requestBody).every((value) => value === null)) {
            // No changes were made, so we can just re-enable the submit button and return early
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Speichern");
            this.notificationService.info("Keine Änderungen", "Es wurden keine Änderungen vorgenommen.");
            return;
        }

        // Send only the changed values to the backend
        const request = this.accountService.updateExpandedUserInformation(requestBody);

        request.subscribe(async (response: UpdateExpandedUserInformationApiEndpointResponse): Promise<void> => {
            if (response.error && response.data.partialUpdate) {
                let alreadyDoneUpdatesReadableString = response.data.alreadyDoneUpdates[0];

                for (let i = 1; i < response.data.alreadyDoneUpdates.length; i++) {
                    if (i === response.data.alreadyDoneUpdates.length - 1 || response.data.alreadyDoneUpdates.length in [1, 2]) {
                        continue;
                    }

                    alreadyDoneUpdatesReadableString += `, ${response.data.alreadyDoneUpdates[i]}`;
                }

                if (response.data.alreadyDoneUpdates.length > 1) {
                    alreadyDoneUpdatesReadableString += ` und ${response.data.alreadyDoneUpdates[response.data.alreadyDoneUpdates.length - 1]}`;
                }

                this.notificationService.warning(
                    "Teilweise erfolgreich",
                    `${response.message} Folgende Änderungen haben geklappt: ${alreadyDoneUpdatesReadableString
                        .replace("role", "Rolle")
                        .replace("motive", "Motivation")
                        .replace("profession", "Beruf")
                        .replace("secondaryPicture", "Sekundäres Bild")}`,
                );

                // Don't return here since we still want to update the user details
            } else if (response.error) {
                this.notificationService.error("Fehler", response.message);
                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Speichern");
                return;
            } else {
                this.notificationService.success("Erfolg", "Alle Änderungen wurden erfolgreich gespeichert.");
            }

            this.expandedUser.set({
                profession: response.data.newUser?.profession || this.expandedUser().profession,
                motive: response.data.newUser?.motive || this.expandedUser().motive,
                role: response.data.newUser?.role || this.expandedUser().role,
                secondaryPicture: response.data.newUser?.secondaryPicture || this.expandedUser().secondaryPicture,
            });

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Speichern");
        });
    }

    private updateInput(event: string | number | object | null, controlName: "professionControl" | "motiveControl"): void {
        if (typeof event === "string" && event.trim() !== "") {
            this.editProfileForm.patchValue({
                [controlName]: event,
            });
        } else if (typeof event === "string" && event.trim() === "") {
            // Set initial value
            switch (controlName) {
                case "professionControl":
                    this.editProfileForm.patchValue({ professionControl: this.expandedUser().profession });
                    break;
                case "motiveControl":
                    this.editProfileForm.patchValue({ motiveControl: this.expandedUser().motive });
                    break;
            }
        } else {
            console.warn(`Received non-string value for ${controlName}:`, event);
        }
    }

    updateProfessionInput(event: string | number | object | null) {
        this.updateInput(event, "professionControl");
    }

    updateMotiveInput(event: string | number | object | null) {
        this.updateInput(event, "motiveControl");
    }


    abortSubmit(errorMessage: string): void {
        this.notificationService.error("Eingabefehler", errorMessage);

        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Speichern");
    }
}
