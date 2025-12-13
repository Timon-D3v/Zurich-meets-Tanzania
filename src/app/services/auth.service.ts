import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { ApiEndpointResponse, ApiEndpointResponseWithRedirect, GetPublicUserDetailsApiEndpointResponse, NewUser, PublicUser } from "../..";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NotificationService } from "./notification.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    readonly user = signal<null | PublicUser>(null);
    readonly isLoggedIn = signal<boolean>(false);

    readonly MAX_RETRIES = 5;

    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    private platformId = inject(PLATFORM_ID);

    login(email: string, password: string): Observable<ApiEndpointResponse> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        const request = this.http.post<ApiEndpointResponse>("/api/auth/login", {
            email,
            password,
        });

        return request;
    }

    signUp(user: NewUser): Observable<ApiEndpointResponse> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        const formData = new FormData();

        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("name", user.name);
        formData.append("family_name", user.family_name);
        formData.append("address", user.address);
        formData.append("postalCode", user.postalCode);
        formData.append("city", user.city);
        formData.append("phone", user.phone);
        formData.append("hasPicture", user.picture === null ? "false" : "true");
        formData.append("picture", user.picture === null ? new Blob([""]) : user.picture);

        const request = this.http.post<ApiEndpointResponse>("/api/auth/signup", formData);

        return request;
    }

    confirmSingUp(email: string, code: string): Observable<ApiEndpointResponseWithRedirect> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        const request = this.http.post<ApiEndpointResponseWithRedirect>("/api/auth/confirmSignUp", {
            email,
            code,
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

            this.user.set(response.data.user);
            this.isLoggedIn.set(response.data.isLoggedIn);
        });
    }

    logout(): void {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        const request = this.http.post<ApiEndpointResponse>("/api/auth/logout", null);

        request.subscribe((response: ApiEndpointResponse): void => {
            if (response.error) {
                this.notificationService.error("Unerwarteter Fehler:", response.message);
            }

            this.user.set(null);
            this.isLoggedIn.set(false);

            this.notificationService.info("Ausgeloggt!", response.message);

            this.router.navigate(["/"]);
        });
    }

    startPasswordRecovery(email: string): Observable<ApiEndpointResponseWithRedirect> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        const request = this.http.post<ApiEndpointResponseWithRedirect>("/api/auth/startPasswordRecovery", {
            email,
        });

        return request;
    }

    confirmPasswordRecovery(email: string, code: string): Observable<ApiEndpointResponseWithRedirect> {
        if (!isPlatformBrowser(this.platformId)) {
            throw new Error("Cannot send POST request if current platform is not browser. Current platform: " + this.platformId);
        }

        const request = this.http.post<ApiEndpointResponseWithRedirect>("/api/auth/confirmPasswordRecovery", {
            email,
            code,
        });

        return request;
    }
}
