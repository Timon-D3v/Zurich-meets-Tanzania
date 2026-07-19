import { Component, signal, inject, OnInit } from "@angular/core";
import { DonationAmountInputComponent } from "../donation-amount-input/donation-amount-input.component";
import { NotificationService } from "../../services/notification.service";
import { EditAccountInputComponent } from "../edit-account-input/edit-account-input.component";
import { EditAccountSelectInputComponent } from "../edit-account-select-input/edit-account-select-input.component";
import { DonationService } from "../../services/donation.service";
import { PUBLIC_CONFIG } from "../../../publicConfig"
import { GetDonationUsageTypesApiEndpointResponse, SelectOption, ApiEndpointResponse } from "../../..";

@Component({
    selector: "app-donation-form",
    imports: [DonationAmountInputComponent, EditAccountInputComponent, EditAccountSelectInputComponent],
    templateUrl: "./donation-form.component.html",
    styleUrl: "./donation-form.component.scss",
})
export class DonationFormComponent implements OnInit {
    currentStage = signal<1 | 2 | 3>(1);
    buttonText = signal<string>("Weiter");
    buttonDisabled = signal<boolean>(false);

    formData = {
        amount: signal<number>(0),
        firstName: signal<string>(""),
        lastName: signal<string>(""),
        email: signal<string>(""),
        usageType: signal<string>("Allgemeine Spende"),
    };

    lockStage2 = signal<boolean>(false);
    donationUsageTypes = signal<SelectOption[]>([
        {
            disabled: false,
            label: "Allgemeine Spende",
            selected: true,
            value: "Allgemeine Spende",
        },
        {
            disabled: true,
            label: "Mehr werden geladen...",
            selected: false,
            value: "Mehr werden geladen...",
        },
    ]);

    private notificationService = inject(NotificationService);
    private donationService = inject(DonationService);

    ngOnInit(): void {
        this.getDonationUsageTypes();
    }

    nextStage(): void {
        if (this.currentStage() === 1) {
            const amountValue = this.formData.amount();

            if (amountValue <= 0) {
                this.notificationService.info("Kein gültiger Betrag", "Bitte geben Sie einen gültigen Spendenbetrag ein.");
                return;
            }

            this.currentStage.set(2);

            this.lockStage2.set(true);

            setTimeout(() => this.lockStage2.set(false), 2000);
        } else if (this.currentStage() === 2) {
            if (this.lockStage2()) {
                this.notificationService.info("Etwas Geduld bitte...", "Bitte scannen Sie den QR-Code um eine Überweisung zu tätigen und versuchen sie es in ein paar Sekunden noch einmal.");
                return;
            }

            this.currentStage.set(3);
            this.buttonText.set("Absenden");
        } else {
            this.submitDonationForm(new Event("submit"));
        }
    }

    submitDonationForm(event: Event): void {
        event.preventDefault();

        this.buttonDisabled.set(true);
        this.buttonText.set("Senden...");

        const data = {
            amount: this.formData.amount(),
            firstName: this.formData.firstName(),
            lastName: this.formData.lastName(),
            email: this.formData.email(),
            usageType: this.formData.usageType(),
        };

        if (typeof data.amount !== "number" || data.amount <= 0) {
            this.notificationService.error("Kein gültiger Betrag", "Bitte geben Sie einen gültigen Spendenbetrag ein.");

            this.currentStage.set(1);
            this.buttonDisabled.set(false);
            this.buttonText.set("Weiter");

            return;
        }

        if (typeof data.firstName !== "string" || data.firstName.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte geben Sie einen gültigen Vornamen ein.");

            this.buttonDisabled.set(false);
            this.buttonText.set("Absenden");

            return;
        }

        if (typeof data.lastName !== "string" || data.lastName.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte geben Sie einen gültigen Nachnamen ein.");

            this.buttonDisabled.set(false);
            this.buttonText.set("Absenden");

            return;
        }

        if (typeof data.email !== "string" || data.email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(data.email)) {
            this.notificationService.error("Eingabefehler:", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");

            this.buttonDisabled.set(false);
            this.buttonText.set("Absenden");

            return;
        }

        if (typeof data.usageType !== "string" || data.usageType.trim() === "" || !this.donationUsageTypes().some((option) => option.value === data.usageType)) {
            this.notificationService.error("Eingabefehler:", "Bitte wählen Sie eine gültige Spendenverwendung aus.");

            this.buttonDisabled.set(false);
            this.buttonText.set("Absenden");

            return;
        }

        const request = this.donationService.submitDonationForm(data.amount, data.firstName, data.lastName, data.email, data.usageType);

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Beim Absenden des Formulars ist ein Fehler aufgetreten: " + response.message);

                    this.buttonDisabled.set(false);
                    this.buttonText.set("Absenden");

                    return;
                }

                this.buttonDisabled.set(false);
                this.currentStage.set(1);
                this.buttonText.set("Weiter");

                this.notificationService.success("Erfolg", "Deine Daten wurden erfolgreich gespeichert. Vielen Dank für Ihre Spende!");

                this.formData.amount.set(0);
                this.formData.firstName.set("");
                this.formData.lastName.set("");
                this.formData.email.set("");
                this.formData.usageType.set("Allgemeine Spende");
            },
            error: (error) => {
                console.error(error);

                this.notificationService.error("Netzwerkfehler:", "Beim Absenden des Formulars ist ein Fehler aufgetreten: " + error.message);

                this.buttonDisabled.set(false);
                this.buttonText.set("Absenden");
            },
        });
    }

    previousStage(): void {
        if (this.currentStage() === 2) {
            this.currentStage.set(1);
        } else if (this.currentStage() === 3) {
            this.currentStage.set(2);
            this.buttonText.set("Weiter");
        }
    }

    setAmount(amount: number) {
        this.formData.amount.set(amount);
    }

    setFirstName(firstName: null | string | number | object) {
        if (typeof firstName !== "string") {
            console.error("First name must be a string.");
            return;
        }

        this.formData.firstName.set(firstName);
    }

    setLastName(lastName: null | string | number | object) {
        console.log("Setting last name:", lastName, "\nType:", typeof lastName);
        if (typeof lastName !== "string") {
            console.error("Last name must be a string.");
            return;
        }
        this.formData.lastName.set(lastName);
    }

    setEmail(email: null | string | number | object) {
        if (typeof email !== "string") {
            console.error("Email must be a string.");
            return;
        }
        this.formData.email.set(email);
    }

    setUsageType(usageType: null | string | number | object) {
        if (typeof usageType !== "string") {
            console.error("Usage type must be a string.");
            return;
        }
        this.formData.usageType.set(usageType);
    }

    getDonationUsageTypes(): void {
        const request = this.donationService.getDonationUsageTypes();

        request.subscribe((response: GetDonationUsageTypesApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler beim Laden der Spendenverwendungsarten", response.message);

                this.donationUsageTypes.set([
                    {
                        disabled: false,
                        label: "Allgemeine Spende",
                        selected: true,
                        value: "Allgemeine Spende",
                    },
                    {
                        disabled: true,
                        label: "Mehr werden geladen...",
                        selected: false,
                        value: "Mehr werden geladen...",
                    },
                ]);

                return;
            }

            this.donationUsageTypes.set([]);

            for (const usageType of response.data) {
                this.donationUsageTypes.update((currentUsageTypes) => [
                    ...currentUsageTypes,
                    {
                        disabled: false,
                        label: usageType,
                        selected: false,
                        value: usageType,
                    },
                ]);
            }
        });
    }
}
