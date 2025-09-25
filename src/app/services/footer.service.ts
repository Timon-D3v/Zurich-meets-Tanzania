import { inject, Injectable } from "@angular/core";
import { AddToNewsletterListApiEndpointResponse } from "../..";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FooterService {
    private http = inject(HttpClient);

    addToNewsletterList(firstName: string, lastName: string, email: string, gender: "Herr" | "Frau" | "Divers"): Observable<AddToNewsletterListApiEndpointResponse> {
        const request = this.http.post<AddToNewsletterListApiEndpointResponse>("/api/newsletter/signUp", {
            firstName,
            lastName,
            email,
            gender,
        });

        return request;
    }
}
