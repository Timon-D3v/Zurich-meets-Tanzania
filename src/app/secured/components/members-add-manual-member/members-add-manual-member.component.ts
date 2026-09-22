import { Component, OnInit, signal, inject } from "@angular/core";
import { LegacyMember } from "../../../..";
import { MembershipService } from "../../../services/membership.service";
import { NotificationService } from "../../../services/notification.service";
import { UnverifiedLegacyMemberApprovalComponent } from "../../../components/unverified-legacy-member-approval/unverified-legacy-member-approval.component";
import { PopupSelectionInputComponent } from "../../../components/popup-selection-input/popup-selection-input.component";
import { AdminManagementService } from "../../../services/admin-management.service";

@Component({
    selector: "app-members-add-manual-member",
    imports: [UnverifiedLegacyMemberApprovalComponent, PopupSelectionInputComponent],
    templateUrl: "./members-add-manual-member.component.html",
    styleUrl: "./members-add-manual-member.component.scss",
})
export class MembersAddManualMemberComponent implements OnInit {
    unverifiedMembers = signal<LegacyMember[]>([]);
    userEmailList = signal<string[]>([]);
    selectionOpen = signal<boolean>(false);

    private membershipService = inject(MembershipService);
    private notificationService = inject(NotificationService);
    private adminManagementService = inject(AdminManagementService);

    // TODO

    // Fetch all unverified member
    // List them in a table

    // Add a form to add a new member manually

    ngOnInit(): void {
        this.getUnverifiedMembers();
        this.getAllUserEmails();
    }

    getAllUserEmails(): void {
        const request = this.adminManagementService.getAllUserEmails();

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der E-Mail-Adressen ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.userEmailList.set(response.data.map((user) => user.email));
            },
            error: (error) => {
                console.error("Error while fetching user emails:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der E-Mail-Adressen ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    getUnverifiedMembers(): void {
        const request = this.membershipService.getUnverifiedLegacyMembers();

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Abrufen der unverifizierten Mitglieder ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.unverifiedMembers.set(response.data);
            },
            error: (error) => {
                console.error("Error while fetching unverified members:", error);
                this.notificationService.error("Fehler:", "Beim Abrufen der unverifizierten Mitglieder ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    addLegacyMember(email: string): void {
        this.closeSelection();

        const request = this.membershipService.createLegacyMember(email);

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Hinzufügen des Mitglieds ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", "Mitglied erfolgreich hinzugefügt.");
                this.getUnverifiedMembers();
            },
            error: (error) => {
                console.error("Error while adding legacy member:", error);
                this.notificationService.error("Fehler:", "Beim Hinzufügen des Mitglieds ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
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
