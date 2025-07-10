import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    constructor() {
        console.warn("Notification Service is not yet implemented");
    }

    error(message: string): void {
        console.error("Error:", message);
    }

    info(message: string): void {
        console.info("Info:", message);
    }

    success(message: string): void {
        console.log("Success:", message);
    }

    warning(message: string): void {
        console.warn("Warning:", message);
    }
}
