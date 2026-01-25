import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { SubpagesService } from "../services/subpages.service";
import { GetStaticSiteApiEndpointResponse, StaticSite, StaticSiteNames } from "../..";
import { NotificationService } from "../services/notification.service";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { HeroComponent } from "../components/hero/hero.component";
import { CustomTitleComponent } from "../components/custom-title/custom-title.component";
import { CustomSubtitleComponent } from "../components/custom-subtitle/custom-subtitle.component";
import { CustomParagraphComponent } from "../components/custom-paragraph/custom-paragraph.component";
import { CustomImageComponent } from "../components/custom-image/custom-image.component";
import { CustomImageCarouselComponent } from "../components/custom-image-carousel/custom-image-carousel.component";
import { CustomImageWithTextComponent } from "../components/custom-image-with-text/custom-image-with-text.component";
import { CustomLineComponent } from "../components/custom-line/custom-line.component";
import { TeamFromIdComponent } from "../components/team-from-id/team-from-id.component";
import { LoadingComponent } from "../components/loading/loading.component";
import { isPlatformBrowser } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-static-site",
    imports: [HeroComponent, CustomTitleComponent, CustomSubtitleComponent, CustomParagraphComponent, CustomImageComponent, CustomImageCarouselComponent, CustomImageWithTextComponent, CustomLineComponent, LoadingComponent, TeamFromIdComponent],
    templateUrl: "./static-site.component.html",
    styleUrl: "./static-site.component.scss",
})
export class StaticSiteComponent {
    siteName: StaticSiteNames = "zurich-meets-tanzania"; // Default, will be overwritten in ngOnInit

    site = signal<StaticSite>(PUBLIC_CONFIG.STATIC_SITES.LOADING(this.siteName, PUBLIC_CONFIG.FALLBACK_IMAGE_URL));
    date = signal<string>("");

    private subpagesService = inject(SubpagesService);
    private notificationService = inject(NotificationService);

    private route = inject(ActivatedRoute);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.siteName = this.route.snapshot.data["siteName"] as StaticSiteNames;

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot fetch when not in browser context.");

            this.site.set(PUBLIC_CONFIG.STATIC_SITES.ERROR(this.siteName, PUBLIC_CONFIG.FALLBACK_IMAGE_URL, "Cannot fetch when not in browser context."));

            return;
        }

        const request = this.subpagesService.getStaticSite(this.siteName);

        request.subscribe((response: GetStaticSiteApiEndpointResponse) => {
            if (response.error || response.data === null) {
                this.notificationService.error("Fehler beim Laden der Seite", `Die Seite '${this.siteName}' konnte nicht geladen werden: ` + response.message);

                // Set a Warning as the sites content
                this.site.set(PUBLIC_CONFIG.STATIC_SITES.ERROR(this.siteName, PUBLIC_CONFIG.FALLBACK_IMAGE_URL, response.message));

                return;
            }

            this.site.set(response.data.site);
            this.date.set(new Date(response.data.date).toLocaleString());
        });
    }
}
