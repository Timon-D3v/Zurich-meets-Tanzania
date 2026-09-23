import { Service, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateCheckoutSessionApiEndpointResponse, ApiEndpointResponse, GetMembersApiEndpointResponse, GetLegacyMembersApiEndpointResponse, GetAllUserEmailsApiEndpointResponse } from "../..";
import { Observable } from "rxjs";

@Service()
export class MembershipService {
    private http = inject(HttpClient);

    getAllMembers(): Observable<GetMembersApiEndpointResponse> {
        const request = this.http.get<GetMembersApiEndpointResponse>("/api/secured/admin/membership/getAllMembers");

        return request;
    }

    getAllLegacyMembers(): Observable<GetLegacyMembersApiEndpointResponse> {
        const request = this.http.get<GetLegacyMembersApiEndpointResponse>("/api/secured/admin/membership/getAllLegacyMembers");

        return request;
    }

    createCheckoutSession(): Observable<CreateCheckoutSessionApiEndpointResponse> {
        const request = this.http.get<CreateCheckoutSessionApiEndpointResponse>("/api/secured/payments/createCheckoutSession");

        return request;
    }

    submitLegacyMembershipForm(): Observable<ApiEndpointResponse> {
        const request = this.http.get<ApiEndpointResponse>("/api/secured/membership/submitLegacyMembershipForm");

        return request;
    }

    getUnverifiedLegacyMembers(): Observable<GetLegacyMembersApiEndpointResponse> {
        const request = this.http.get<GetLegacyMembersApiEndpointResponse>("/api/secured/admin/membership/getUnverifiedLegacyMembers");

        return request;
    }

    acceptLegacyMember(userId: number, memberId: number): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/membership/acceptLegacyMember", { userId, memberId });

        return request;
    }

    rejectLegacyMember(userId: number, memberId: number): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/membership/rejectLegacyMember", { userId, memberId });

        return request;
    }

    createLegacyMember(email: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/membership/createLegacyMembership", { email });

        return request;
    }

    getAllLegacyMemberEmails(): Observable<GetAllUserEmailsApiEndpointResponse> {
        const request = this.http.get<GetAllUserEmailsApiEndpointResponse>("/api/secured/admin/membership/getAllLegacyMemberEmails");

        return request;
    }

    removeLegacyMember(email: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/membership/removeLegacyMember", { email });

        return request;
    }
}
