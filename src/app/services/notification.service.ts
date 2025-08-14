import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Notification } from "../..";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    notificationSubject = new Subject<Notification>();
    notificationObservable = this.notificationSubject.asObservable();

    /**
     * Sends an error notification.
     *
     * @param {string} title - The title of the error notification.
     * @param {string} message - The message content of the error notification.
     * @param {boolean} [closable=true] - Indicates whether the notification can be closed by the user. Defaults to true.
     * @returns {void}
     */
    error(title: string, message: string, closable: boolean = true): void {
        this.notificationSubject.next({
            type: "error",
            title,
            message,
            closable,
        });
    }

    /**
     * Displays a warning notification.
     *
     * @param {string} title - The title of the warning notification.
     * @param {string} message - The message content of the warning notification.
     * @param {boolean} [closable=true] - Indicates whether the notification can be closed by the user. Defaults to true.
     * @returns {void}
     */
    warn(title: string, message: string, closable: boolean = true): void {
        this.notificationSubject.next({
            type: "warn",
            title,
            message,
            closable,
        });
    }

    /**
     * Displays a warning notification with the specified title and message.
     *
     * @param {string} title - The title of the warning notification.
     * @param {string} message - The message content of the warning notification.
     * @param {boolean} [closable=true] - Optional. Indicates whether the notification can be closed by the user. Defaults to true.
     * @returns {void}
     */
    warning(title: string, message: string, closable: boolean = true): void {
        this.warn(title, message, closable);
    }

    /**
     * Displays an informational notification.
     *
     * @param {string} title - The title of the notification.
     * @param {string} message - The message content of the notification.
     * @param {boolean} [closable=true] - Indicates whether the notification can be closed by the user. Defaults to true.
     * @returns {void}
     */
    info(title: string, message: string, closable: boolean = true): void {
        this.notificationSubject.next({
            type: "info",
            title,
            message,
            closable,
        });
    }

    /**
     * Sends a success notification.
     *
     * @param {string} title - The title of the notification.
     * @param {string} message - The message content of the notification.
     * @param {boolean} [closable=true] - Indicates whether the notification can be closed by the user. Defaults to true.
     * @returns {void}
     */
    success(title: string, message: string, closable: boolean = true): void {
        this.notificationSubject.next({
            type: "success",
            title,
            message,
            closable,
        });
    }

    /**
     * Sends a neutral notification.
     *
     * @param {string} title - The title of the notification.
     * @param {string} message - The message content of the notification.
     * @param {boolean} [closable=true] - Indicates whether the notification can be closed by the user. Defaults to true.
     * @returns {void}
     */
    neutral(title: string, message: string, closable: boolean = true): void {
        this.notificationSubject.next({
            type: "neutral",
            title,
            message,
            closable,
        });
    }
}
