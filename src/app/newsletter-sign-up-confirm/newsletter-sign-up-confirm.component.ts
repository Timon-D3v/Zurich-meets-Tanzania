import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { NewsletterService } from "../services/newsletter.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiEndpointResponse } from "../..";
import { NotificationService } from "../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { HeroComponent } from "../components/hero/hero.component";

@Component({
    selector: "app-newsletter-sign-up-confirm",
    imports: [HeroComponent],
    templateUrl: "./newsletter-sign-up-confirm.component.html",
    styleUrl: "./newsletter-sign-up-confirm.component.scss",
})
export class NewsletterSignUpConfirmComponent implements OnInit {
    heroSubtitle = signal<string>("Du wirst bald weitergeleitet");
    buttonVisible = signal<boolean>(false);
    redirectSeconds = signal<number>(10);

    private route = inject(ActivatedRoute);
    private router = inject(Router);

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
            // if (response.error) {
            //     this.notificationService.error("Etwas hat nicht geklappt.", response.message);

            //     this.router.navigate(["/"]);

            //     return;
            // }

            this.notificationService.success("Das hat geklappt.", "Du hast dich erfolgreich für den Newsletter angemeldet.");

            this.buttonVisible.set(true);

            this.autoRedirect();
        });
    }

    autoRedirect(): void {
        if (this.redirectSeconds() === 0) {
            this.router.navigate(["/"]);

            return;
        }

        this.heroSubtitle.set(`Du wirst in ${this.redirectSeconds()} Sekunden weitergeleitet...`);

        this.redirectSeconds.update((value) => value - 1);

        setTimeout(() => this.autoRedirect(), 1000);
    }
}
