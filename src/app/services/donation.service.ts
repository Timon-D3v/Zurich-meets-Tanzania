import { Service, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GetDonationUsageTypesApiEndpointResponse, ApiEndpointResponse } from "../..";

@Service()
export class DonationService {
    private http = inject(HttpClient);

    getDonationUsageTypes(): Observable<GetDonationUsageTypesApiEndpointResponse> {
        const request = this.http.get<GetDonationUsageTypesApiEndpointResponse>(`/api/donation/getDonationUsageTypes`);

        return request;
    }

    submitDonationForm(amount: number, firstName: string, lastName: string, email: string, usageType: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>(`/api/donation/submitDonationForm`, {
            amount,
            firstName,
            lastName,
            email,
            usageType,
        });

        return request;
    }
}
