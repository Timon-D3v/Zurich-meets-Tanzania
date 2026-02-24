import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetVisitorCountsApiEndpointResponse } from "../..";
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
}
