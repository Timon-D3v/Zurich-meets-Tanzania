import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointResponse, GetTeamApiEndpointResponse } from "../..";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class TeamService {
    private http = inject(HttpClient);

    createTeam(motto: string, description: string, image: File): Observable<ApiEndpointResponse> {
        const formData = new FormData();

        formData.append("motto", motto);
        formData.append("description", description);
        formData.append("image", image);

        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/team/createTeam", formData);

        return request;
    }

    getCurrentTeam(): Observable<GetTeamApiEndpointResponse> {
        const request = this.http.get<GetTeamApiEndpointResponse>("/api/team/getCurrentTeam");

        return request;
    }

    getTeam(id: number): Observable<GetTeamApiEndpointResponse> {
        const request = this.http.get<GetTeamApiEndpointResponse>(`/api/team/getTeam?id=${id}`);

        return request;
    }

    addMember(email: string, job: string, motivation: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/team/addMember", { email, job, motivation });

        return request;
    }

    removeMember(email: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/team/removeMember", { email });

        return request;
    }
}
