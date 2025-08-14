import { isPlatformBrowser } from "@angular/common";
import { Component, inject, input, OnInit, output, PLATFORM_ID, signal } from "@angular/core";
import { NotificationTypes } from "../../..";

@Component({
    selector: "app-notification",
    imports: [],
    templateUrl: "./notification.component.html",
    styleUrl: "./notification.component.scss",
})
export class NotificationComponent implements OnInit {
    type = input<NotificationTypes>("neutral");
    message = input("Das ist eine Nachricht");
    title = input("Nachricht:");
    closable = input(true);
    preloader = input(false);

    iconSrc = signal("/svg/neutral.svg");
    iconAlt = signal("Neutrale Benachrichtigung Icon");

    closeEvent = output<void>();

    modes = {
        neutral: {
            iconSrc: "/svg/notification/neutral.svg",
            iconAlt: "Neutrale Benachrichtigung Icon",
        },
        success: {
            iconSrc: "/svg/notification/success.svg",
            iconAlt: "Erfolgreiche Benachrichtigung Icon",
        },
        error: {
            iconSrc: "/svg/notification/error.svg",
            iconAlt: "Fehlerhafte Benachrichtigung Icon",
        },
        warn: {
            iconSrc: "/svg/notification/warn.svg",
            iconAlt: "Warnende Benachrichtigung Icon",
        },
        info: {
            iconSrc: "/svg/notification/info.svg",
            iconAlt: "Informative Benachrichtigung Icon",
        },
    };

    private platformId = inject(PLATFORM_ID);

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * This method sets the icon source and alternative text based on the notification type.
     *
     * It switches over the possible notification types ("neutral", "success", "error", "warn", "info")
     * and sets the corresponding icon source and alternative text for each type.
     * If the type is not recognized, it defaults to the "neutral" type.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        switch (this.type()) {
            case "neutral":
                this.iconSrc.set(this.modes.neutral.iconSrc);
                this.iconAlt.set(this.modes.neutral.iconAlt);
                break;
            case "success":
                this.iconSrc.set(this.modes.success.iconSrc);
                this.iconAlt.set(this.modes.success.iconAlt);
                break;
            case "error":
                this.iconSrc.set(this.modes.error.iconSrc);
                this.iconAlt.set(this.modes.error.iconAlt);
                break;
            case "warn":
                this.iconSrc.set(this.modes.warn.iconSrc);
                this.iconAlt.set(this.modes.warn.iconAlt);
                break;
            case "info":
                this.iconSrc.set(this.modes.info.iconSrc);
                this.iconAlt.set(this.modes.info.iconAlt);
                break;
            default:
                this.iconSrc.set(this.modes.neutral.iconSrc);
                this.iconAlt.set(this.modes.neutral.iconAlt);
                break;
        }
    }

    /**
     * Emits the closeEvent to notify that the notification should be closed.
     * This method can be called to programmatically close the notification.
     *
     * @returns {void}
     */
    close(): void {
        this.closeEvent.emit();
    }
}
