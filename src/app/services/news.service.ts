import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiEndpointResponse, GetAllNewsApiEndpointResponse, GetNewsApiEndpointResponse, NewsContent } from "../..";
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

    createNews(newsContent: NewsContent, images: { url: string; file: File }[], sendNewsletter: boolean): Observable<ApiEndpointResponse> {
        const formData = new FormData();

        const imageNames = images.map((image) => image.url);

        formData.append("newsContent", JSON.stringify(newsContent));
        formData.append("imageNames", JSON.stringify(imageNames));
        formData.append("sendNewsletter", sendNewsletter ? "true" : "false");

        images.forEach((image) => {
            formData.append("images", image.file);
        });

        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/news/createNews", formData);

        return request;
    }
}
