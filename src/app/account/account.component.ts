import { Component, effect, inject, signal } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AccountService } from "../services/account.service";
import { PublicUser, UpdateUserProfilePictureWithIdApiEndpointResponse } from "../..";
import { EditAccountInformationComponent } from "../components/edit-account-information/edit-account-information.component";
import { PopupImageInputComponent } from "../components/popup-image-input/popup-image-input.component";
import { NotificationService } from "../services/notification.service";
import { EditAccountPreferencesComponent } from "../components/edit-account-preferences/edit-account-preferences.component";
import { ViewAccountMembershipDetailsComponent } from "../components/view-account-membership-details/view-account-membership-details.component";

@Component({
    selector: "app-account",
    imports: [EditAccountInformationComponent, PopupImageInputComponent, EditAccountPreferencesComponent, ViewAccountMembershipDetailsComponent],
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
        picture: "/svg/personal.svg",
    });

    bannerId = signal<number>(this.getRandomInt(1, 10));

    editPictureInputOpen = signal(false);

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
                picture: "/svg/personal.svg",
            });
        } else {
            this.user.set(userObject);
        }
    });

    editPictureInputResult(event: { file: File | null; url: string }): void {
        if (event.file === null) {
            this.closeEditPictureInput();

            this.notificationService.info("Keine Datei ausgewählt:", "Es wurde keine Datei ausgewählt, daher wurde das Profilbild nicht aktualisiert.");

            return;
        }

        this.closeEditPictureInput();
        this.notificationService.info("Datei ausgewählt:", "Dein neues Profilbild wird hochgeladen. Dies kann einen Moment dauern...");

        const request = this.accountService.updateUserProfilePicture(event.file);

        request.subscribe((response: UpdateUserProfilePictureWithIdApiEndpointResponse) => {
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
        });
    }

    editPicture(): void {
        this.editPictureInputOpen.set(true);
    }

    closeEditPictureInput(): void {
        this.editPictureInputOpen.set(false);
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
