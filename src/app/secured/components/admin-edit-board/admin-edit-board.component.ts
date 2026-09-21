import { Component, signal, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { BoardComponent } from "../../../components/board/board.component";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";
import { PopupConfirmComponent } from "../../../components/popup-confirm/popup-confirm.component";
import { AdminManagementService } from "../../../services/admin-management.service";
import { NotificationService } from "../../../services/notification.service";
import { GetAllUserEmailsApiEndpointResponse } from "../../../..";
import { take, Subject } from "rxjs";

@Component({
    imports: [BoardComponent, PopupSelectionInputComponent, PopupConfirmComponent],
    selector: "app-admin-edit-board",
    styleUrl: "./admin-edit-board.component.scss",
    templateUrl: "./admin-edit-board.component.html",
})
export class AdminEditBoardComponent implements OnInit {
    selectionInputOpen = signal(false);
    confirmInputOpen = signal(false);

    action = signal<"add" | "remove">("add");
    selection = signal<string | null>(null);

    emailList = signal<string[]>([]);

    confirmInputObservable = new Subject<boolean>();
    selectionInputObservable = new Subject<string>();

    private platformId = inject(PLATFORM_ID);

    private adminService = inject(AdminManagementService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot make API calls on the server side. Email list will not be loaded.");
            return;
        }

        const request = this.adminService.getAllUserEmails();

        request.subscribe({
            next: (response: GetAllUserEmailsApiEndpointResponse): void => {
                if (response.error || !response.data) {
                    console.error("Failed to load email list:", response.message);
                    this.notificationService.error("Fehler:", "Die E-Mail-Liste konnte nicht geladen werden. Bitte versuchen Sie es später erneut.");
                    return;
                }

                this.emailList.set(response.data.map((user) => user.email));
            },
            error: (error: any): void => {
                console.error("Failed to load email list:", error);
                this.notificationService.error("Fehler:", "Die E-Mail-Liste konnte nicht geladen werden. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    async editBoard(type: "add" | "remove"): Promise<void> {
        this.action.set(type);

        const selectedEmail = await this.awaitSelection();

        this.selection.set(selectedEmail);

        const confirmed = await this.awaitConfirmation();

        if (!confirmed) {
            this.notificationService.info("Abgebrochen:", "Die Aktion wurde abgebrochen.");
            return;
        }

        if (type === "add") {
            this.addBoardMember(selectedEmail);
        } else {
            this.removeBoardMember(selectedEmail);
        }
    }

    addBoardMember(email: string): void {
        const request = this.adminService.addBoardMember(email);

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error("Failed to add board member:", response.message);
                    this.notificationService.error("Fehler:", "Das Vorstandsmitglied konnte nicht hinzugefügt werden." + (response.message || "Bitte versuchen Sie es später erneut."));
                    return;
                }

                this.notificationService.success("Erfolg:", "Das Vorstandsmitglied wurde erfolgreich hinzugefügt.");
            },
            error: (error) => {
                console.error("Failed to add board member:", error);
                this.notificationService.error("Fehler:", "Das Vorstandsmitglied konnte nicht hinzugefügt werden. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    removeBoardMember(email: string): void {
        const request = this.adminService.removeBoardMember(email);

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error("Failed to remove board member:", response.message);
                    this.notificationService.error("Fehler:", "Das Vorstandsmitglied konnte nicht entfernt werden." + (response.message || "Bitte versuchen Sie es später erneut."));
                    return;
                }

                this.notificationService.success("Erfolg:", "Das Vorstandsmitglied wurde erfolgreich entfernt.");
            },
            error: (error) => {
                console.error("Failed to remove board member:", error);
                this.notificationService.error("Fehler:", "Das Vorstandsmitglied konnte nicht entfernt werden. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    async awaitSelection(): Promise<string> {
        this.selectionInputOpen.set(true);

        return new Promise<string>((resolve) => {
            this.selectionInputObservable.pipe(take(1)).subscribe({
                next: (result) => {
                    resolve(result);
                },
                error: (error) => {
                    console.error("Error while awaiting selection:", error);

                    this.notificationService.error("Fehler:", "Beim Auswählen des Vorstandsmitglieds ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");

                    resolve("");
                },
            });
        });
    }

    async awaitConfirmation(): Promise<boolean> {
        this.confirmInputOpen.set(true);

        return new Promise<boolean>((resolve) => {
            this.confirmInputObservable.pipe(take(1)).subscribe({
                next: (result) => {
                    resolve(result || false);
                },
                error: (error) => {
                    console.error("Error while awaiting confirmation:", error);
                    resolve(false);
                },
            });
        });
    }

    handleConfirmInputResult(confirmed: boolean): void {
        this.confirmInputOpen.set(false);

        this.confirmInputObservable.next(confirmed);
    }

    handleSelectionInputResult(selection: string): void {
        this.selectionInputOpen.set(false);

        this.selectionInputObservable.next(selection);
    }
}
