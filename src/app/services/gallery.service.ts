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

    getAllGalleryTitlesAndSubtitles(): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.get<DatabaseApiEndpointResponse>("/api/secured/admin/gallery/getAllGalleryTitlesAndSubtitles", {});

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

    updateGalleryImages(title: string, files: { file: File; url: string }[]): Observable<ApiEndpointResponse> {
        const formData = new FormData();

        formData.append("title", title);

        for (const file of files) {
            formData.append("files", file.file);
            formData.append("urls", file.url);
        }

        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/gallery/updateGalleryImages", formData);

        return request;
    }

    updateGalleryDetails(title: string, newTitle: string, newSubtitle: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/gallery/updateGalleryDetails", {
            title,
            newTitle,
            newSubtitle,
        });

        return request;
    }
}
