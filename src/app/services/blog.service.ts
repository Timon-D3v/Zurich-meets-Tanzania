import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Observable } from "rxjs";
import { DatabaseResult } from "../..";

@Injectable({
    providedIn: "root",
})
export class BlogService {
    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    getBlogsLinks(count: number = 5): Observable<DatabaseResult> {
        const request = this.http.post<DatabaseResult>(`/api/blog/getLinks/${count}`, {});

        this.notificationService.info("Worked", "With message");

        return request;
    }
}
