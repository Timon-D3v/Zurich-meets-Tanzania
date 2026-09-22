import { Component, input, inject, output } from "@angular/core";
import { ApiEndpointResponse, LegacyMember } from "../../..";
import { MembershipService } from "../../services/membership.service";
import { NotificationService } from "../../services/notification.service";

@Component({
    imports: [],
    selector: "app-unverified-legacy-member-approval",
    styleUrl: "./unverified-legacy-member-approval.component.scss",
    templateUrl: "./unverified-legacy-member-approval.component.html",
})
export class UnverifiedLegacyMemberApprovalComponent {
    member = input.required<LegacyMember>();

    update = output<void>();

    private membershipService = inject(MembershipService);
    private notificationService = inject(NotificationService);

    acceptMember(): void {
        const request = this.membershipService.acceptLegacyMember(this.member().userId, this.member().legacyMemberId);

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Akzeptieren des Mitglieds ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.success("Erfolg:", "Mitglied erfolgreich akzeptiert.");
                this.update.emit();
            },
            error: (error) => {
                console.error("Error while accepting member:", error);
                this.notificationService.error("Fehler:", "Beim Akzeptieren des Mitglieds ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    rejectMember(): void {
        const request = this.membershipService.rejectLegacyMember(this.member().userId, this.member().legacyMemberId);

        request.subscribe({
            next: (response: ApiEndpointResponse) => {
                if (response.error) {
                    console.error(response.message);
                    this.notificationService.error("Fehler:", "Beim Ablehnen des Mitglieds ist ein Fehler aufgetreten: " + response.message);
                    return;
                }

                this.notificationService.info("Abgelehnt:", "Mitglied erfolgreich abgelehnt.");
                this.update.emit();
            },
            error: (error) => {
                console.error("Error while rejecting member:", error);
                this.notificationService.error("Fehler:", "Beim Ablehnen des Mitglieds ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            },
        });
    }

    formatTimestamp(timestamp: number): string {
        return new Date(timestamp).toLocaleDateString("de-CH", {
            // weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
            // hour: "numeric",
            // minute: "2-digit",
        });
    }
}
