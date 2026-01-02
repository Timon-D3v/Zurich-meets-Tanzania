import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiEndpointResponse } from "../..";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AdminManagementService {
    private http = inject(HttpClient);

    addAdmin(email: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/management/addAdmin", {
            email,
        });

        return request;
    }

    removeAdmin(email: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/management/removeAdmin", {
            email,
        });

        return request;
    }

    createUser(email: string, firstName: string, lastName: string, address: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/management/createUser", {
            email,
            firstName,
            lastName,
            address,
        });

        return request;
    }
}
