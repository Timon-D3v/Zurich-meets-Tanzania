import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetAllStaticSitesApiEndpointResponse, GetStaticSiteApiEndpointResponse, StaticSiteNames } from "../..";

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
}
