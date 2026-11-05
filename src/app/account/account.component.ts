import { Component, effect, inject, signal } from "@angular/core";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { AuthService } from "../services/auth.service";
import { AccountService } from "../services/account.service";
import { PublicUser, UpdateUserProfilePictureWithIdApiEndpointResponse, ApiEndpointResponse } from "../..";
import { EditAccountInformationComponent } from "../components/edit-account-information/edit-account-information.component";
import { PopupImageInputComponent } from "../components/popup-image-input/popup-image-input.component";
import { NotificationService } from "../services/notification.service";
import { EditAccountPreferencesComponent } from "../components/edit-account-preferences/edit-account-preferences.component";
import { ViewAccountMembershipDetailsComponent } from "../components/view-account-membership-details/view-account-membership-details.component";
import { AddAdditionalUserInformationComponent } from "../components/add-additional-user-information/add-additional-user-information.component";
import { AddBoardInformationComponent } from "../components/add-board-information/add-board-information.component";

@Component({
    selector: "app-account",
    imports: [EditAccountInformationComponent, PopupImageInputComponent, EditAccountPreferencesComponent, ViewAccountMembershipDetailsComponent, AddAdditionalUserInformationComponent, AddBoardInformationComponent],
    templateUrl: "./account.component.html",
    styleUrl: "./account.component.scss",
})
export class AccountComponent {
    user = signal<PublicUser>({
        email: "Laden...",
        firstName: "Laden...",
        lastName: "Laden...",
        phone: "Laden...",
        address: "Laden...",
        type: "user",
        picture: PUBLIC_CONFIG.FALLBACK_PROFILE_PICTURE,
    });

    bannerId = signal<number>(this.getRandomInt(1, 10));

    editPictureInputOpen = signal(false);

    isInAnyTeam = signal<boolean>(false);
    isInBoard = signal<boolean>(false);

    private authService = inject(AuthService);
    private accountService = inject(AccountService);
    private notificationService = inject(NotificationService);

    private _updateUserObject = effect(() => {
        const userObject = this.authService.user();

        if (userObject === null) {
            this.user.set({
                email: "Laden...",
                firstName: "Laden...",
                lastName: "Laden...",
                phone: "Laden...",
                address: "Laden...",
                type: "user",
                picture: PUBLIC_CONFIG.FALLBACK_PROFILE_PICTURE,
            });
        } else {
            this.user.set(userObject);
        }

        this.isInAnyTeamCheck();
        this.isInBoardCheck();
    });

    /**
     * <Function>editPictureInputResult</Function>
     * 
     * Handles the result of profile picture upload/input and updates the user's profile picture URL.
     * If no file is selected, shows an info notification and closes the input dialog without performing any upload.
     * For uploaded files, initiates the upload via AccountService, showing loading notifications during the process.
     * On success: updates the user object with the new picture URL (with timestamp for cache-busting) and shows success notification.
     * On API error: displays an error message to the user. On subscription errors: logs to console and notifies about retry.
     * 
     * @param {Event} event - An object containing `file` (the uploaded File object or null) and `url` (optional URL parameter).
     * @returns {void} Does not return a value; handles all asynchronous responses via Observable subscriptions. Throws no errors.
     */
    editPictureInputResult(event: { file: File | null; url: string }): void {
        if (event.file === null) {
            this.closeEditPictureInput();

            this.notificationService.info("Keine Datei ausgewählt:", "Es wurde keine Datei ausgewählt, daher wurde das Profilbild nicht aktualisiert.");

            return;
        }

        this.closeEditPictureInput();
        this.notificationService.info("Datei ausgewählt:", "Dein neues Profilbild wird hochgeladen. Dies kann einen Moment dauern...");

        const request = this.accountService.updateUserProfilePicture(event.file);

        request.subscribe({
            next: (response: UpdateUserProfilePictureWithIdApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler", response.message);
                    return;
                }

                this.notificationService.success("Erfolg", response.message);

                this.user.update((user: PublicUser) => {
                    user.picture = response.data?.pictureUrl || user.picture;

                    user.picture += `?t=${Date.now()}`;

                    return user;
                });
            },
            error: (error: unknown) => {
                console.error("Error while updating user profile picture:", error);
                this.notificationService.error("Fehler", "Das Profilbild konnte nicht aktualisiert werden. Bitte versuche es erneut.");
            },
        });
    }

    /**
     * <Function>split</Function>
     * 
     * Splits a text string into parts with soft line breaks at specified intervals.
     * Inserts non-breaking hyphens between every Nth character to enable line wrapping while preserving word integrity or creating visual spacing effects.
     * Useful for formatting long names, addresses, or descriptions that need to wrap naturally across multiple lines.
     * 
     * @param {string} text - The input text string to split into segments with soft breaks inserted periodically.
     * @param {number} interval - The number of characters between which to insert a non-breaking hyphen (must be a positive integer).
     * @returns {string} A string containing the original text with non-breaking hyphens inserted at every Nth character position (starting from index N). Throws no errors.
     */
    split(text: string, interval: number): string {
        return text
            .split("")
            .map((char, index) => {
                if (index % interval === 0 && index !== 0) {
                    return "\u00AD" + char;
                } else {
                    return char;
                }
            })
            .join("");
    }

    /**
     * <Function>editPicture</Function>
     * 
     * Opens the profile picture input dialog by setting the editPictureInputOpen signal to true.
     * This shows the PopupImageInputComponent for selecting a new profile image file from the user's local storage.
     * 
     * @returns {void} Does not return a value and performs no side effects other than updating the signal state. Throws no errors.
     */
    editPicture(): void {
        this.editPictureInputOpen.set(true);
    }

    /**
     * <Function>closeEditPictureInput</Function>
     * 
     * Closes the profile picture input dialog by setting the editPictureInputOpen signal to false.
     * Dismisses any pending photo upload operations and returns to the normal account view.
     * 
     * @returns {void} Does not return a value and performs no side effects other than updating the signal state. Throws no errors.
     */
    closeEditPictureInput(): void {
        this.editPictureInputOpen.set(false);
    }

    /**
     * <Function>getRandomInt</Function>
     * 
     * Generates a random integer value within a specified range (inclusive) using Math.random().
     * Useful for selecting random options like banner images or rotating featured content.
     * Uses ceil() to ensure minimum and floor() to ensure maximum are always included in possible outputs.
     * 
     * @param {number} min - The minimum value of the range (must be a number less than max; will be rounded up).
     * @param {number} max - The maximum value of the range (must be greater than min; will be rounded down).
     * @returns {number} A random integer between min and max inclusive. Throws no errors.
     */
    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * <Function>isInAnyTeamCheck</Function>
     * 
     * Checks whether the currently authenticated user is a member of any team organization.
     * Makes an API request via AccountService.checkIfUserIsInAnyTeam() and updates the isInAnyTeam signal accordingly.
     * Handles API errors by showing error notifications to the user and logging errors to console.
     * 
     * @returns {void} Does not return a value; performs asynchronous operation via Observable subscription and always completes normally. Throws no errors.
     */
    isInAnyTeamCheck(): void {
        const request = this.accountService.checkIfUserIsInAnyTeam();

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler", response.message);
                    return;
                }

                this.isInAnyTeam.set(response.message === "true");
            },
            error: (error: unknown) => {
                console.error("Error while checking if user is in any team:", error);
                this.notificationService.error("Fehler", "Es konnte nicht geprüft werden, ob du in einem Team bist. Bitte versuche es erneut.");
            },
        });
    }

    /**
     * <Function>isInBoardCheck</Function>
     * 
     * Checks whether the currently authenticated user is a member of the board/vorstand organization.
     * Makes an API request via AccountService.checkIfUserIsInBoard() and updates the isInBoard signal accordingly.
     * Handles API errors by showing error notifications to the user and logging errors to console.
     * 
     * @returns {void} Does not return a value; performs asynchronous operation via Observable subscription and always completes normally. Throws no errors.
     */
    isInBoardCheck(): void {
        const request = this.accountService.checkIfUserIsInBoard();

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler", response.message);
                    return;
                }

                this.isInBoard.set(response.message === "true");
            },
            error: (error: unknown) => {
                console.error("Error while checking if user is in board:", error);
                this.notificationService.error("Fehler", "Es konnte nicht geprüft werden, ob du im Vorstand bist. Bitte versuche es erneut.");
            },
        });
    }
}
