import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GetAllNewsApiEndpointResponse, GetNewsApiEndpointResponse } from "../..";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class NewsService {
    private http = inject(HttpClient);

    getNews(id: number): Observable<GetNewsApiEndpointResponse> {
        const request = this.http.get<GetNewsApiEndpointResponse>("/api/news/getNews/" + id);

        return request;
    }

    getLatestNews(): Observable<GetNewsApiEndpointResponse> {
        const request = this.http.get<GetNewsApiEndpointResponse>("/api/news/getLatestNews");

        return request;
    }

    getAllNews(): Observable<GetAllNewsApiEndpointResponse> {
        const request = this.http.get<GetAllNewsApiEndpointResponse>(`/api/secured/admin/news/getAllNews`);

        return request;
    }
}
