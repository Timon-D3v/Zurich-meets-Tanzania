import { Component, OnInit, signal, inject } from "@angular/core";
import { MembershipService } from "../../../services/membership.service";
import { NotificationService } from "../../../services/notification.service";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";
import { AdminManagementService } from "../../../services/admin-management.service";

@Component({
    selector: "app-members-remove-manual-member",
    imports: [PopupSelectionInputComponent],
    templateUrl: "./members-remove-manual-member.component.html",
    styleUrl: "./members-remove-manual-member.component.scss",
})
export class MembersRemoveManualMemberComponent implements OnInit {
    legacyMemberEmailList = signal<string[]>([]);
    selectionOpen = signal<boolean>(false);

    private membershipService = inject(MembershipService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.getAllLegacyMemberEmails();
    }

    getAllLegacyMemberEmails(): void {
        const request = this.membershipService.getAllLegacyMemberEmails();

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der manuellen Mitglieder ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.legacyMemberEmailList.set(response.data.map((user) => user.email));
            },
            error: (error) => {
                console.error("Error while fetching legacy member emails:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der manuellen Mitglieder ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    removeLegacyMember(email: string): void {
        this.closeSelection();

        const request = this.membershipService.removeLegacyMember(email);

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Entfernen des Mitglieds ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", "Mitglied erfolgreich entfernt.");
                this.getAllLegacyMemberEmails();
            },
            error: (error) => {
                console.error("Error while removing legacy member:", error);
                this.notificationService.error("Fehler:", "Beim Entfernen des Mitglieds ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    openSelection(): void {
        this.selectionOpen.set(true);
    }

    closeSelection(): void {
        this.selectionOpen.set(false);
    }
}
