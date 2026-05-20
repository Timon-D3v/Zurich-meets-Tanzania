import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UpdateUserInformationApiEndpointResponse, UpdateUserInformationRequestBody, UpdateUserProfilePictureWithIdApiEndpointResponse } from "../..";

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
}
