import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Observable } from "rxjs";
import { DatabaseApiEndpointResponse, GetGalleryImagesApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class GalleryService {
    private http = inject(HttpClient);

    getGalleryLinks(count: number = 5): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.get<DatabaseApiEndpointResponse>(`/api/gallery/getLinks/${count}`, {});

        return request;
    }

    getGalleryWithName(name: string): Observable<GetGalleryImagesApiEndpointResponse> {
        const request = this.http.post<GetGalleryImagesApiEndpointResponse>("/api/gallery/getGalleryImages", {
            name
        })

        return request;
    }
}
