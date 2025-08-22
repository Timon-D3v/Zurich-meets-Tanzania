import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Observable } from "rxjs";
import { DatabaseApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class GalleryService {
    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    getGalleryLinks(count: number = 5): Observable<DatabaseApiEndpointResponse> {
        const request = this.http.post<DatabaseApiEndpointResponse>(`/api/gallery/getLinks/${count}`, {});

        this.notificationService.info("Worked", "With message");

        return request;
    }
}
