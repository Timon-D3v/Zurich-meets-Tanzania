import { Component, inject, OnInit, signal } from "@angular/core";
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
import { CurrentTeamComponent } from "../current-team/current-team.component";

@Component({
    selector: "app-vision",
    imports: [HeroComponent, CustomTitleComponent, CustomSubtitleComponent, CustomParagraphComponent, CustomImageComponent, CustomImageCarouselComponent, CustomImageWithTextComponent, CustomLineComponent, CurrentTeamComponent],
    templateUrl: "./vision.component.html",
    styleUrl: "./vision.component.scss",
})
export class VisionComponent implements OnInit {
    siteName: StaticSiteNames = "vision";
    site = signal<StaticSite>(PUBLIC_CONFIG.STATIC_SITES.LOADING(this.siteName, PUBLIC_CONFIG.FALLBACK_IMAGE_URL));

    private subpagesService = inject(SubpagesService);
    private notificationService = inject(NotificationService);

    ngOnInit(): void {
        const request = this.subpagesService.getStaticSite(this.siteName);

        request.subscribe((response: GetStaticSiteApiEndpointResponse) => {
            if (response.error || response.data === null) {
                this.notificationService.error("Fehler beim Laden der Seite", `Die Seite '${this.siteName}' konnte nicht geladen werden: ` + response.message);

                // Set a Warning as the sites content
                this.site.set(PUBLIC_CONFIG.STATIC_SITES.ERROR(this.siteName, PUBLIC_CONFIG.FALLBACK_IMAGE_URL, response.message));

                return;
            }

            this.site.set(response.data.site);
        });
    }
}
