import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Observable } from "rxjs";
import { DatabaseApiEndpointResponse, GetAllBlogsApiEndpointResponse, GetBlogApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class BlogService {
    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    getBlog(title: string): Observable<GetBlogApiEndpointResponse> {
        const request = this.http.get<GetBlogApiEndpointResponse>(`/api/blog/getBlog/${title}`);

        return request;
    }

    getAllBlogs(): Observable<GetAllBlogsApiEndpointResponse> {
        const request = this.http.get<GetAllBlogsApiEndpointResponse>(`/api/blog/getAllBlogs`);

        return request;
    }

    getBlogLinks(count: number = 5): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.get<DatabaseApiEndpointResponse>(`/api/blog/getLinks/${count}`);

        return request;
    }

    getAllBlogLinks(): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.get<DatabaseApiEndpointResponse>("/api/blog/getAllLinks");

        return request;
    }
}
