import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointResponse, GetAllStaticSitesApiEndpointResponse, GetStaticSiteApiEndpointResponse, StaticSite, StaticSiteNames } from "../..";

@Injectable({
    providedIn: "root",
})
export class SubpagesService {
    private http = inject(HttpClient);

    getStaticSite(siteName: StaticSiteNames): Observable<GetStaticSiteApiEndpointResponse> {
        const request = this.http.get<GetStaticSiteApiEndpointResponse>(`/api/subpages/get/${siteName}`);

        return request;
    }

    getAllStaticSites(): Observable<GetAllStaticSitesApiEndpointResponse> {
        const request = this.http.get<GetAllStaticSitesApiEndpointResponse>(`/api/secured/admin/subpages/getAllStaticSites`);

        return request;
    }
    
    updateStaticSite(siteName: StaticSiteNames, site: StaticSite, images: { url: string; file: File }[]): Observable<ApiEndpointResponse> {
        const formData = new FormData();

        const imageNames = images.map((image) => image.url);

        formData.append("siteName", siteName);
        formData.append("site", JSON.stringify(site));
        formData.append("imageNames", JSON.stringify(imageNames));

        images.forEach((image) => {
            formData.append("images", image.file);
        });

        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/subpages/updateStaticSite", formData);

        return request;
    }
}
