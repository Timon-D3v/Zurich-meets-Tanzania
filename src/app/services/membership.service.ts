import { Service, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateCheckoutSessionApiEndpointResponse } from "../..";

@Service()
export class MembershipService {
    private http = inject(HttpClient);

    createCheckoutSession() {
        const request = this.http.get<CreateCheckoutSessionApiEndpointResponse>("/api/secured/payments/createCheckoutSession");

        return request;
    }
}
