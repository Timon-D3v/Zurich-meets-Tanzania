import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
    GetInvoicesApiEndpointResponse,
    UpdateUserInformationApiEndpointResponse,
    UpdateUserInformationRequestBody,
    UpdateUserProfilePictureWithIdApiEndpointResponse,
    UpdateExpandedUserInformationRequestBody,
    UpdateExpandedUserInformationApiEndpointResponse,
    GetExpandedUserInformationApiEndpointResponse,
    ApiEndpointResponse,
} from "../..";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    private http = inject(HttpClient);

    updateUserProfilePicture(picture: File): Observable<UpdateUserProfilePictureWithIdApiEndpointResponse> {
        const formData = new FormData();

        formData.append("image", picture);

        const request = this.http.post<UpdateUserProfilePictureWithIdApiEndpointResponse>("/api/secured/account/updateUserProfilePicture", formData);

        return request;
    }

    updateUserInformation(requestBody: UpdateUserInformationRequestBody): Observable<UpdateUserInformationApiEndpointResponse> {
        const request = this.http.post<UpdateUserInformationApiEndpointResponse>("/api/secured/account/updateUserInformation", requestBody);

        return request;
    }

    updateExpandedUserInformation(requestBody: UpdateExpandedUserInformationRequestBody): Observable<UpdateExpandedUserInformationApiEndpointResponse> {
        const request = this.http.post<UpdateExpandedUserInformationApiEndpointResponse>("/api/secured/account/updateExpandedUserInformation", requestBody);

        return request;
    }

    getInvoices(): Observable<GetInvoicesApiEndpointResponse> {
        const request = this.http.get<GetInvoicesApiEndpointResponse>("/api/secured/account/getInvoices");

        return request;
    }

    checkIfUserIsInAnyTeam(): Observable<ApiEndpointResponse> {
        const request = this.http.get<ApiEndpointResponse>("/api/secured/account/inAnyTeamCheck");

        return request;
    }

    getExpandedUserInformation(): Observable<GetExpandedUserInformationApiEndpointResponse> {
        const request = this.http.get<GetExpandedUserInformationApiEndpointResponse>("/api/secured/account/getExpandedUserInformation");

        return request;
    }

    checkIfUserIsInBoard(): Observable<ApiEndpointResponse> {
        const request = this.http.get<ApiEndpointResponse>("/api/secured/account/inBoardCheck");

        return request;
    }

    getBoardRole(): Observable<ApiEndpointResponse> {
        const request = this.http.get<GetExpandedUserInformationApiEndpointResponse>("/api/secured/account/getBoardRole");

        return request;
    }

    updateBoardRole(role: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/account/updateBoardRole", { role });

        return request;
    }

    isLegacyMemberCheck(): Observable<ApiEndpointResponse> {
        const request = this.http.get<ApiEndpointResponse>("/api/secured/account/isLegacyMemberCheck");

        return request;
    }
}
