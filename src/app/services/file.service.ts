import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetAllFileInformationApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class FileService {
    private http = inject(HttpClient);

    getAllFiles(): Observable<GetAllFileInformationApiEndpointResponse> {
        const request = this.http.get<GetAllFileInformationApiEndpointResponse>("/api/secured/admin/management/getAllFiles");

        return request;
    }
}
