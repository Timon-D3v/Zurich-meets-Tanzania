import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { NewsletterService } from "../services/newsletter.service";
import { ActivatedRoute } from "@angular/router";
import { ApiEndpointResponse } from "../..";
import { NotificationService } from "../services/notification.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-newsletter-sign-up-confirm",
    imports: [],
    templateUrl: "./newsletter-sign-up-confirm.component.html",
    styleUrl: "./newsletter-sign-up-confirm.component.scss",
})
export class NewsletterSignUpConfirmComponent implements OnInit {
    private route = inject(ActivatedRoute);

    private newsletterService = inject(NewsletterService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.sendConfirmation();
    }

    sendConfirmation(): void {
        const params = this.route.snapshot.queryParams;

        const request = this.newsletterService.confirmSignUp(params["firstName"] ?? "", params["lastName"] ?? "", params["email"] ?? "", params["gender"] ?? "", params["id"] ?? "", params["timestamp"] ?? "");

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Etwas hat nicht geklappt.", response.message);

                return;
            }

            this.notificationService.success("Das hat geklappt.", "Du hast dich erfolgreich für den Newsletter angemeldet.");
        });
    }
}
