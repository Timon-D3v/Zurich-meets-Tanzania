import { Component, input, OnInit, signal, inject } from "@angular/core";
import { PublicUser, Invoice, GetInvoicesApiEndpointResponse } from "../../../";
import { RouterLink } from "@angular/router";
import { LoadingComponent } from "../loading/loading.component";
import { AccountService } from "../../services/account.service";
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: "app-view-account-membership-details",
    imports: [RouterLink, LoadingComponent],
    templateUrl: "./view-account-membership-details.component.html",
    styleUrl: "./view-account-membership-details.component.scss",
})
export class ViewAccountMembershipDetailsComponent implements OnInit {
    user = input.required<PublicUser>();

    invoices = signal<Invoice[]>([]);

    private accountService = inject(AccountService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.getInvoices();
    }

    getInvoices(): void {
        const request = this.accountService.getInvoices();

        request.subscribe((response: GetInvoicesApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler bin Laden:", "Deine Rechnungen konnten nicht geladen werden. Bitte versuche es später erneut.");

                return;
            }

            this.invoices.set(response.data || []);
        });
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);

        return date.toLocaleDateString("de-CH", {
            month: "short",
            year: "numeric",
        });
    }
}
