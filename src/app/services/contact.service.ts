import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointResponse, GetContactRequestVerificationTokenApiEndpointResponse } from "../..";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ContactService {
    private http = inject(HttpClient);

    submitMessageAndGetVerificationToken(firstName: string, lastName: string, email: string, message: string): Observable<GetContactRequestVerificationTokenApiEndpointResponse> {
        const request = this.http.post<GetContactRequestVerificationTokenApiEndpointResponse>("/api/contact/getVerificationToken", {
            firstName,
            lastName,
            email,
            message,
        });

        return request;
    }

    confirmVerificationToken(token: string, verificationCode: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/contact/confirmVerificationToken", {
            token,
            verificationCode,
        });

        return request;
    }
}
