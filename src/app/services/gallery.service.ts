import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointResponse, DatabaseApiEndpointResponse, GetGalleryImagesApiEndpointResponse } from "../..";

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
            name,
        });

        return request;
    }

    getAllGalleryTitles(): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.get<DatabaseApiEndpointResponse>("/api/secured/admin/gallery/getAllGalleryTitles", {});

        return request;
    }

    addGallery(title: string, subtitle: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/gallery/addGallery", {
            title,
            subtitle,
        });

        return request;
    }

    removeGallery(title: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/gallery/removeGallery", {
            title,
        });

        return request;
    }
}
