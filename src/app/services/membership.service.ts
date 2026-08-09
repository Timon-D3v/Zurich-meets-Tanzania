import { Service, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateCheckoutSessionApiEndpointResponse, ApiEndpointResponse } from "../..";

@Service()
export class MembershipService {
    private http = inject(HttpClient);

    createCheckoutSession() {
        const request = this.http.get<CreateCheckoutSessionApiEndpointResponse>("/api/secured/payments/createCheckoutSession");

        return request;
    }

    submitLegacyMembershipForm() {
        const request = this.http.get<ApiEndpointResponse>("/api/secured/membership/submitLegacyMembershipForm");

        return request;
    }
}
