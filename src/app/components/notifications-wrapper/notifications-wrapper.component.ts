import { Component, ComponentRef, inject, OnDestroy, OnInit, viewChild, ViewContainerRef } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { NotificationComponent } from "../notification/notification.component";
import { Notification, NotificationTypes } from "../../..";
import { Subscription } from "rxjs";

@Component({
    selector: "app-notifications-wrapper",
    imports: [],
    templateUrl: "./notifications-wrapper.component.html",
    styleUrl: "./notifications-wrapper.component.scss",
})
export class NotificationsWrapperComponent implements OnInit, OnDestroy {
    viewComponent = viewChild("anchor", {
        read: ViewContainerRef,
    });

    private notificationService = inject(NotificationService);
    subscription: Subscription | null = null;

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * This method is used to preload a notification to prevent an error when notifications are called via the notificationService.
     * It also subscribes to the notificationObservable of the notificationService to display notifications.
     *
     * @remarks
     * - Preload a notification to prevent an error when notifications are called via the notificationService.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        // Preload a notification
        // Somehow this prevents an error when notifications are called via the notificationService
        this.showWithObjectInput(
            {
                type: "info",
                title: "Info",
                message: "Das ist eine Info",
                closable: true,
            },
            true,
        );

        this.subscription = this.notificationService.notificationObservable.subscribe((notification: Notification): void => {
            this.showWithObjectInput(notification);
        });
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     *
     * This method performs cleanup by unsubscribing from the subscription
     * if it is not null. This helps to prevent memory leaks by ensuring
     * that the subscription is properly disposed of when the component
     * is no longer in use.
     *
     * @returns {void}
     */
    ngOnDestroy(): void {
        if (this.subscription === null) return;

        this.subscription.unsubscribe();
    }

    /**
     * Creates and returns a component reference for the NotificationComponent.
     *
     * @returns {ComponentRef<NotificationComponent> | undefined} A reference to the created NotificationComponent, or undefined if the view component is not available.
     */
    createComponent(): ComponentRef<NotificationComponent> | undefined {
        const component = NotificationComponent;

        return this.viewComponent()?.createComponent(component, {
            index: 0,
        });
    }

    /**
     * Destroys the given notification component.
     *
     * @param {ComponentRef<NotificationComponent>} component - The reference to the notification component to be destroyed.
     * @returns {void}
     */
    destroyComponent(component: ComponentRef<NotificationComponent>): void {
        component.destroy();
    }

    /**
     * Destroys all dynamically created components within the view.
     * This method clears the view container, removing all its child components.
     *
     * @returns {void}
     */
    destroyAllComponents(): void {
        this.viewComponent()?.clear();
    }

    /**
     * Displays a notification with the specified parameters.
     *
     * @param {NotificationTypes} type - The type of the notification (e.g., success, error, info).
     * @param {string} title - The title of the notification.
     * @param {string} message - The message content of the notification.
     * @param {boolean} [closable=true] - Determines if the notification can be closed by the user.
     * @param {boolean} [preloader=false] - Determines if a preloader should be shown in the notification.
     * @returns {void}
     */
    show(type: NotificationTypes, title: string, message: string, closable: boolean = true, preloader: boolean = false): void {
        const component = this.createComponent();

        if (typeof component === "undefined" || component === undefined) return console.error("Component is undefined");

        component.setInput("type", type);
        component.setInput("message", message);
        component.setInput("title", title);
        component.setInput("closable", closable);
        component.setInput("preloader", preloader);

        component.instance.closeEvent.subscribe((): void => {
            this.destroyComponent(component);
        });

        setTimeout((): void => {
            this.destroyComponent(component);
        }, 10000);
    }

    /**
     * Displays a notification using an object as input.
     *
     * @param {Notification} input - The notification object containing the details to be displayed.
     * @param {boolean} [preloader=false] - Optional boolean to indicate if a preloader should be shown. Defaults to false.
     *
     * @returns {void}
     */
    showWithObjectInput(input: Notification, preloader: boolean = false): void {
        this.show(input.type, input.title, input.message, input.closable, preloader);
    }
}
