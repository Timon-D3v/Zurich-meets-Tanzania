import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointResponse, EditUserCommand, GetAllUsersApiEndpointResponse, GetVisitorCountsApiEndpointResponse, UpdateUserProfilePictureWithIdApiEndpointResponse, UpdateUserWithIdApiEndpointResponse } from "../..";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class AnalyticsService {
    private http = inject(HttpClient);

    getVisitorCounts(days: number): Observable<GetVisitorCountsApiEndpointResponse> {
        const request = this.http.post<GetVisitorCountsApiEndpointResponse>("/api/secured/admin/analytics/getVisitorCount", { days });

        return request;
    }

    getAllUsers(): Observable<GetAllUsersApiEndpointResponse> {
        const request = this.http.get<GetAllUsersApiEndpointResponse>("/api/secured/admin/analytics/getAllUsers");

        return request;
    }

    updateUser(userId: number, data: EditUserCommand[]): Observable<UpdateUserWithIdApiEndpointResponse> {
        const request = this.http.post<UpdateUserWithIdApiEndpointResponse>("/api/secured/admin/analytics/updateUserWithId", { userId, data });

        return request;
    }

    uploadPicture(userId: number, data: EditUserCommand): Observable<UpdateUserProfilePictureWithIdApiEndpointResponse> {
        const formData = new FormData();

        if (data.fieldType !== "picture" || data.executionType !== "edit") {
            throw new Error("Invalid field type for uploadPicture");
        }

        if (!data.pictureUploaded || !data.picture || data.picture === null || typeof data.picture === "undefined") {
            throw new Error("No picture uploaded for profile picture");
        }

        formData.append("userId", userId.toString());
        formData.append("picture", data.picture);

        const request = this.http.post<UpdateUserProfilePictureWithIdApiEndpointResponse>("/api/secured/admin/analytics/uploadProfilePictureForUserWithId", formData);

        return request;
    }

    deleteUser(userId: number): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/analytics/deleteUserWithId", { userId });

        return request;
    }
}
