import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { AdminUnknownPageComponent } from "../admin-unknown-page/admin-unknown-page.component";
import { GetPasswordsApiEndpointResponse, LoginInformation } from "../../../..";
import { NotificationService } from "../../../services/notification.service";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-admin-passwords-page",
    imports: [AdminUnknownPageComponent],
    templateUrl: "./admin-passwords-page.component.html",
    styleUrl: "./admin-passwords-page.component.scss",
})
export class AdminPasswordsPageComponent implements OnInit {
    doneFetching = signal<boolean>(false);
    failedFetching = signal<boolean>(false);

    passwords = signal<LoginInformation[]>([]);

    private notificationService = inject(NotificationService);

    private http = inject(HttpClient);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot fetch when not in browser context.");

            this.failedFetching.set(true);

            return;
        }

        this.fetchPasswords();
    }

    fetchPasswords(): void {
        const request = this.http.get<GetPasswordsApiEndpointResponse>("/api/secured/admin/management/getPasswords");

        request.subscribe((response: GetPasswordsApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Laden fehlgeschlagen: ", response.message);

                this.failedFetching.set(true);

                return;
            }

            this.passwords.set(response.data);
            this.doneFetching.set(true);
        });
    }
}
