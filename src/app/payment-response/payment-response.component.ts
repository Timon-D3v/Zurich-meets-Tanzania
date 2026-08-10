import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Notification } from "../..";
import { NotificationService } from "../services/notification.service";
import { LoadingComponent } from "../components/loading/loading.component";

@Component({
    selector: "app-payment-response",
    imports: [LoadingComponent],
    templateUrl: "./payment-response.component.html",
    styleUrl: "./payment-response.component.scss",
})
export class PaymentResponseComponent implements OnInit {
    private notificationService = inject(NotificationService);

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        const status = this.route.snapshot.data["status"] as "success" | "cancelled";

        if (status === "success") {
            this.notificationService.success("Zahlung erfolgreich", "Vielen Dank für deine Zahlung. Wir haben sie erfolgreich erhalten und werden dich per sofort als Mitglied in unserem System registrieren.");

            this.router.navigate(["/"]);
        } else if (status === "cancelled") {
            this.notificationService.error("Zahlung abgebrochen", "Deine Zahlung wurde abgebrochen. Solltest du Fragen haben, kontaktiere uns gerne via dem Kontaktformular.");
            this.router.navigate(["/membership"]);
        }
    }
}
