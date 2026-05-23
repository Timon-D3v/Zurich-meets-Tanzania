import { Component, inject, input, OnInit, signal } from "@angular/core";
import { PublicUser, UpdateUserInformationApiEndpointResponse, UpdateUserInformationRequestBody } from "../../..";
import { EditAccountInputComponent } from "../edit-account-input/edit-account-input.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-edit-account-information",
    imports: [EditAccountInputComponent, ReactiveFormsModule],
    templateUrl: "./edit-account-information.component.html",
    styleUrl: "./edit-account-information.component.scss",
})
export class EditAccountInformationComponent implements OnInit {
    submitButtonDisabled = signal(false);
    submitButtonText = signal("Speichern");

    user = input.required<PublicUser>();

    editProfileForm = new FormGroup({
        emailControl: new FormControl(""),
        passwordControl: new FormControl(""),
        firstNameControl: new FormControl(""),
        lastNameControl: new FormControl(""),
        addressControl: new FormControl(""),
        postalCodeControl: new FormControl(""),
        cityControl: new FormControl(""),
        phoneControl: new FormControl(""),
    });

    private authService = inject(AuthService);
    private accountService = inject(AccountService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.editProfileForm.patchValue({
            emailControl: this.user().email,
            firstNameControl: this.user().firstName,
            lastNameControl: this.user().lastName,
            addressControl: this.user().address.split(",")[0],
            postalCodeControl: this.user().address.split(", ")[1].split(" ")[0],
            cityControl: this.user().address.split(", ")[1].split(" ").slice(1).join(" "),
            phoneControl: this.user().phone,
        });
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Speichern...");

        // Validate inputs
        const email = this.editProfileForm.value.emailControl;
        const password = this.editProfileForm.value.passwordControl;
        const firstName = this.editProfileForm.value.firstNameControl;
        const lastName = this.editProfileForm.value.lastNameControl;
        const address = this.editProfileForm.value.addressControl;
        const postalCode = this.editProfileForm.value.postalCodeControl;
        const city = this.editProfileForm.value.cityControl;
        const phone = this.editProfileForm.value.phoneControl;

        console.log(email, password, firstName, lastName, address, postalCode, city, phone);

        if (!email || typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            return this.abortSubmit("Bitte gib eine gültige E-Mail-Adresse ein.");
        }

        if (typeof password !== "string") {
            // Password is expected to be empty since it is hashed and isn't reflected in the formControl
            // If the password is not a string however, this means an error occurred, so we want to show an error message and not proceed with the form submission
            return this.abortSubmit("Bitte gib ein gültiges Passwort ein.");
        }

        if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
            return this.abortSubmit("Bitte gib einen gültigen Vornamen ein.");
        }

        if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
            return this.abortSubmit("Bitte gib einen gültigen Nachnamen ein.");
        }

        if (!address || typeof address !== "string" || address.trim() === "") {
            return this.abortSubmit("Bitte gib eine gültige Adresse ein.");
        }

        if (!postalCode || typeof postalCode !== "string" || postalCode.trim() === "" || !/^(?:[A-Z]{2}-\d{3,6}|\d{3,6})$/.test(postalCode)) {
            return this.abortSubmit("Bitte gib eine gültige Postleitzahl ein.");
        }

        if (!city || typeof city !== "string" || city.trim() === "") {
            return this.abortSubmit("Bitte gib eine gültige Stadt ein.");
        }

        if (typeof phone !== "string") {
            // When this happens, an error occurred, so we want to show an error message and not proceed with the form submission
            return this.abortSubmit("Bitte gib eine gültige Telefonnummer ein.");
        }

        if (phone !== "" && phone !== "Keine Nummer" && !/^\+?[0-9\s\-()]{6,20}$/.test(phone)) {
            // Actual validation of the phone number, allowing empty string but if not empty, it should be a valid phone number or "Keine Nummer"
            return this.abortSubmit('Bitte gib eine gültige Telefonnummer ein oder tippe "Keine Nummer" um deine Telefonnummer zu entfernen.');
        }

        console.info("All inputs are valid. Proceeding with form submission...");

        const updatedUserData = {
            email: email.trim(),
            password: password, // Don't trim the password since we want to allow leading and trailing spaces in the password, as this is a common practice to increase the password strength
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            address: `${address.trim()}, ${postalCode.trim()} ${city.trim()}`,
            postalCode: postalCode.trim(),
            city: city.trim(),
            phone: phone.trim(),
        };

        // Look for values that changed
        const requestBody: UpdateUserInformationRequestBody = {
            email: updatedUserData.email !== this.user().email ? updatedUserData.email : null,
            password: updatedUserData.password !== "" ? updatedUserData.password : null, // Only send the password if it is not empty, since we don't want to reset the password to an empty string if the user didn't enter a new password
            firstName: updatedUserData.firstName !== this.user().firstName ? updatedUserData.firstName : null,
            lastName: updatedUserData.lastName !== this.user().lastName ? updatedUserData.lastName : null,
            address: updatedUserData.address !== this.user().address ? updatedUserData.address : null,
            phone: updatedUserData.phone !== this.user().phone ? updatedUserData.phone : null,
        };

        if (Object.values(requestBody).every((value) => value === null)) {
            // No changes were made, so we can just re-enable the submit button and return early
            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Speichern");
            this.notificationService.info("Keine Änderungen", "Es wurden keine Änderungen vorgenommen.");
            return;
        }

        // Send only the changed values to the backend
        const request = this.accountService.updateUserInformation(requestBody);

        request.subscribe(async (response: UpdateUserInformationApiEndpointResponse): Promise<void> => {
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
                        .replace("email", "E-Mail")
                        .replace("password", "Passwort")
                        .replace("firstName", "Vorname")
                        .replace("lastName", "Nachname")
                        .replace("address", "Adresse")
                        .replace("phone", "Telefonnummer")}`,
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

            this.authService.getCurrentUserDetails();

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Speichern");
        });
    }

    private updateInput(event: string | number | object | null, controlName: "emailControl" | "passwordControl" | "firstNameControl" | "lastNameControl" | "addressControl" | "postalCodeControl" | "cityControl" | "phoneControl"): void {
        if (typeof event === "string" && event.trim() !== "") {
            this.editProfileForm.patchValue({
                [controlName]: event,
            });
        } else if (typeof event === "string" && event.trim() === "") {
            // Set initial value
            switch (controlName) {
                case "emailControl":
                    this.editProfileForm.patchValue({ emailControl: this.user().email });
                    break;
                case "passwordControl":
                    console.info("Password input cleared, but since we don't store the actual password, we can't reset it to the original value. Keeping it empty.");
                    break;
                case "firstNameControl":
                    this.editProfileForm.patchValue({ firstNameControl: this.user().firstName });
                    break;
                case "lastNameControl":
                    this.editProfileForm.patchValue({ lastNameControl: this.user().lastName });
                    break;
                case "addressControl":
                    this.editProfileForm.patchValue({ addressControl: this.user().address.split(",")[0] });
                    break;
                case "postalCodeControl":
                    this.editProfileForm.patchValue({ postalCodeControl: this.user().address.split(", ")[1].split(" ")[0] });
                    break;
                case "cityControl":
                    this.editProfileForm.patchValue({ cityControl: this.user().address.split(", ")[1].split(" ").slice(1).join(" ") });
                    break;
                case "phoneControl":
                    // Don't set the initial value but the default since the user might want to remove their phone number by entering an empty string
                    this.editProfileForm.patchValue({ phoneControl: "Keine Nummer" });
                    break;
            }
        } else {
            console.warn(`Received non-string value for ${controlName}:`, event);
        }
    }

    updateEmailInput(event: string | number | object | null) {
        this.updateInput(event, "emailControl");
    }

    updatePasswordInput(event: string | number | object | null) {
        this.updateInput(event, "passwordControl");
    }

    updateFirstNameInput(event: string | number | object | null) {
        this.updateInput(event, "firstNameControl");
    }

    updateLastNameInput(event: string | number | object | null) {
        this.updateInput(event, "lastNameControl");
    }

    updateAddressInput(event: string | number | object | null) {
        this.updateInput(event, "addressControl");
    }

    updatePostalCodeInput(event: string | number | object | null) {
        this.updateInput(event, "postalCodeControl");
    }

    updateCityInput(event: string | number | object | null) {
        this.updateInput(event, "cityControl");
    }

    updatePhoneInput(event: string | number | object | null) {
        this.updateInput(event, "phoneControl");
    }

    abortSubmit(errorMessage: string): void {
        this.notificationService.error("Eingabefehler", errorMessage);

        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Speichern");
    }
}
