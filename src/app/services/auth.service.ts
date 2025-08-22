import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { ApiEndpointResponse, GetPublicUserDetailsApiEndpointResponse, PublicUser } from "../..";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    readonly user = signal<null | PublicUser>(null);
    readonly isLoggedIn = signal<boolean>(false);

    readonly MAX_RETRIES = 5;

    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    login(email: string, password: string): Observable<ApiEndpointResponse> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        const request = this.http.post<ApiEndpointResponse>("/api/auth/login", {
            email: email,
            password: password,
        });

        return request;
    }

    getCurrentUserDetails(currentTry: number = 0): void {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        if (currentTry >= this.MAX_RETRIES) {
            console.error(`Could not get User data ${this.MAX_RETRIES} times. Giving up and logging out.`);
            this.notificationService.error("Schwerer Fehler!", "Benutzerdaten konnten nicht geladen werden. Du wirst aus Sicherheitsgründen ausgeloggt.");
            this.logout();
        }

        const request = this.http.get<GetPublicUserDetailsApiEndpointResponse>("/api/auth/getUserDetails");

        request.subscribe((response: GetPublicUserDetailsApiEndpointResponse): void => {
            if (response.error || response.data === null) {
                return this.getCurrentUserDetails(currentTry + 1);
            }

            this.user.set(response.data);
            this.isLoggedIn.set(true);
        });
    }

    logout(): void {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        console.log("Hello worlds")

        const request = this.http.post<ApiEndpointResponse>("/api/auth/logout", null);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Unerwarteter Fehler:", response.message);
            }

            this.user.set(null);
            this.isLoggedIn.set(false);

            this.notificationService.info("Ausgeloggt!", response.message);
        });
    }
}
