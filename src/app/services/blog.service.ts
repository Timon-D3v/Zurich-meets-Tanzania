import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointResponse, BlogContent, DatabaseApiEndpointResponse, GetAllBlogsApiEndpointResponse, GetBlogApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class BlogService {
    private http = inject(HttpClient);

    getBlog(title: string): Observable<GetBlogApiEndpointResponse> {
        const request = this.http.get<GetBlogApiEndpointResponse>(`/api/blog/getBlog/${title}`);

        return request;
    }

    getAllBlogs(): Observable<GetAllBlogsApiEndpointResponse> {
        const request = this.http.get<GetAllBlogsApiEndpointResponse>(`/api/secured/admin/blog/getAllBlogs`);

        return request;
    }

    getBlogLinks(count: number = 5): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.get<DatabaseApiEndpointResponse>(`/api/blog/getTitles/${count}`);

        return request;
    }

    getAllBlogLinks(): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.get<DatabaseApiEndpointResponse>("/api/secured/admin/blog/getAllTitles");

        return request;
    }

    createBlog(blogName: string, blog: BlogContent, images: { url: string; file: File }[]): Observable<ApiEndpointResponse> {
        const formData = new FormData();

        const imageNames = images.map((image) => image.url);

        formData.append("blogName", blogName);
        formData.append("blog", JSON.stringify(blog));
        formData.append("imageNames", JSON.stringify(imageNames));

        images.forEach((image) => {
            formData.append("images", image.file);
        });

        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/blog/createBlog", formData);

        return request;
    }

    updateBlog(blogName: string, blog: BlogContent, images: { url: string; file: File }[]): Observable<ApiEndpointResponse> {
        const formData = new FormData();

        const imageNames = images.map((image) => image.url);

        formData.append("blogName", blogName);
        formData.append("blog", JSON.stringify(blog));
        formData.append("imageNames", JSON.stringify(imageNames));

        images.forEach((image) => {
            formData.append("images", image.file);
        });

        const request = this.http.post<ApiEndpointResponse>("/api/secured/admin/blog/updateBlog", formData);

        return request;
    }
}
