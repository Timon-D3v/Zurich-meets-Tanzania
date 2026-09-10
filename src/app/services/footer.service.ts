import { inject, Injectable } from "@angular/core";
import { AddToNewsletterListApiEndpointResponse } from "../..";
import { Observable } from "rxjs";
import { NewsletterService } from "./newsletter.service";

@Injectable({
    providedIn: "root",
})
export class FooterService {
    private newsletterService = inject(NewsletterService);

    addToNewsletterList(firstName: string, lastName: string, email: string, gender: "Herr" | "Frau" | "Divers"): Observable<AddToNewsletterListApiEndpointResponse> {
        const request = this.newsletterService.signUp(firstName, lastName, email, gender);

        return request;
    }
}
