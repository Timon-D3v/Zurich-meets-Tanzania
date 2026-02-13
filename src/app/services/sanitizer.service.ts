import { inject, Injectable } from "@angular/core";
import { PublicEnvService } from "./public-env.service";
import { PUBLIC_CONFIG } from "../../publicConfig";

@Injectable({
    providedIn: "root",
})
export class SanitizerService {
    private publicEnvService = inject(PublicEnvService);

    async verifyUrlIsTrusted(url: string): Promise<boolean> {
        const ORIGIN = await this.publicEnvService.getOrigin();
        const CDN_URL = PUBLIC_CONFIG.CDN_URL;
        const DELIVAPI_USER = await this.publicEnvService.getDelivApiUser();

        const CDN_URL_WITH_USER = `${CDN_URL}${DELIVAPI_USER}/`;

        try {
            // Check if the URL has a trusted origin
            if (!url.startsWith(ORIGIN) && !url.startsWith(CDN_URL_WITH_USER) && !url.startsWith(`blob:${ORIGIN}`)) {
                throw new Error(`URL is not from a trusted origin. URL: ${url}, Trusted Origins: ${ORIGIN}, ${CDN_URL_WITH_USER}`);
            }

            return true;
        } catch (error) {
            if (error instanceof Error) {
                console.warn("URL verification error:", error.message);

                return false;
            }

            console.error(error);

            return false;
        }
    }
}
