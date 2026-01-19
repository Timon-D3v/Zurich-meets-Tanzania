import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetStaticSiteApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class SubpagesService {
    private http = inject(HttpClient);

    getStaticSite(
        siteName:
            | "vision"
            | "board"
            | "beginning"
            | "finances"
            | "income-statement"
            | "general-meeting"
            | "statutes"
            | "zurich-meets-tanzania"
            | "tanzania-meets-zurich"
            | "mbuzi"
            | "gynecology"
            | "meducation"
            | "bajaji"
            | "cardiology"
            | "surgery"
            | "history",
    ): Observable<GetStaticSiteApiEndpointResponse> {
        const request = this.http.get<GetStaticSiteApiEndpointResponse>(`/api/subpages/get/${siteName}`);

        return request;
    }
}
