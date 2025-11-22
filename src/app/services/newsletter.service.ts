import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AddToNewsletterListApiEndpointResponse, ApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class NewsletterService {
    private http = inject(HttpClient);

    signUp(firstName: string, lastName: string, email: string, gender: "Herr" | "Frau" | "Divers"): Observable<AddToNewsletterListApiEndpointResponse> {
        const request = this.http.post<AddToNewsletterListApiEndpointResponse>("/api/newsletter/signUp", {
            firstName,
            lastName,
            email,
            gender,
        });

        return request;
    }

    confirmSignUp(firstName: string, lastName: string, email: string, gender: string, id: string, timestamp: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/newsletter/confirm", {
            firstName,
            lastName,
            email,
            gender,
            id,
            timestamp,
        });

        return request;
    }
}
