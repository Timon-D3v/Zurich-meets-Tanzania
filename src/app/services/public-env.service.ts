import { inject, Injectable, signal } from "@angular/core";
import { ApiEndpointResponse, PublicEnvVariables } from "../..";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({
    providedIn: "root",
})
export class PublicEnvService {
    private cache = signal<PublicEnvVariables>({
        ORIGIN: null,
        ENV: null,
        DELIVAPI_USER: null,
    });

    private notificationService = inject(NotificationService);

    private http = inject(HttpClient);

    async getOrigin(): Promise<string> {
        if (typeof this.cache()["ORIGIN"] === "string") {
            return this.cache()["ORIGIN"] as string;
        }

        const response = await lastValueFrom(this.http.get<ApiEndpointResponse>("/api/env/ORIGIN"));

        if (response.error) {
            this.notificationService.error("App Fehler", response.message);

            throw new Error(response.message);
        }

        this.cache.update((value) => {
            value.ORIGIN = response.message;

            return value;
        });

        return response.message;
    }

    async getEnv(): Promise<"dev" | "prod"> {
        if (typeof this.cache()["ENV"] === "string") {
            return this.cache()["ENV"] as "dev" | "prod";
        }

        const response = await lastValueFrom(this.http.get<ApiEndpointResponse>("/api/env/ENV"));

        if (response.error) {
            this.notificationService.error("App Fehler", response.message);

            throw new Error(response.message);
        }

        this.cache.update((value) => {
            value.ENV = response.message as "dev" | "prod";

            return value;
        });

        return response.message as "dev" | "prod";
    }

    async getDelivApiUser(): Promise<string> {
        if (typeof this.cache()["DELIVAPI_USER"] === "string") {
            return this.cache()["DELIVAPI_USER"] as string;
        }

        const response = await lastValueFrom(this.http.get<ApiEndpointResponse>("/api/env/DELIVAPI_USER"));

        if (response.error) {
            this.notificationService.error("App Fehler", response.message);

            throw new Error(response.message);
        }

        this.cache.update((value) => {
            value.DELIVAPI_USER = response.message;

            return value;
        });

        return response.message;
    }
}
