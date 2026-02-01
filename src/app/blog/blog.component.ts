import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Blog, GetBlogApiEndpointResponse } from "../..";
import { BlogService } from "../services/blog.service";
import { NotificationService } from "../services/notification.service";
import { HeroComponent } from "../components/hero/hero.component";
import { PUBLIC_CONFIG } from "../../publicConfig";
import { LoadingComponent } from "../components/loading/loading.component";
import { TeamFromIdComponent } from "../components/team-from-id/team-from-id.component";
import { CustomLineComponent } from "../components/custom-line/custom-line.component";
import { CustomImageWithTextComponent } from "../components/custom-image-with-text/custom-image-with-text.component";
import { CustomImageCarouselComponent } from "../components/custom-image-carousel/custom-image-carousel.component";
import { CustomImageComponent } from "../components/custom-image/custom-image.component";
import { CustomParagraphComponent } from "../components/custom-paragraph/custom-paragraph.component";
import { CustomSubtitleComponent } from "../components/custom-subtitle/custom-subtitle.component";
import { CustomTitleComponent } from "../components/custom-title/custom-title.component";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-blog",
    imports: [HeroComponent, LoadingComponent, TeamFromIdComponent, CustomLineComponent, CustomImageWithTextComponent, CustomImageCarouselComponent, CustomImageComponent, CustomParagraphComponent, CustomSubtitleComponent, CustomTitleComponent],
    templateUrl: "./blog.component.html",
    styleUrl: "./blog.component.scss",
})
export class BlogComponent implements OnInit {
    private name = signal("");

    blog = signal<Blog>(PUBLIC_CONFIG.BLOGS.LOADING(this.name(), PUBLIC_CONFIG.FALLBACK_IMAGE_URL));

    private blogService = inject(BlogService);
    private notificationService = inject(NotificationService);

    private route = inject(ActivatedRoute);
    private router = inject(Router);

    private platformId = inject(PLATFORM_ID);

    private _updateContent = effect(() => {
        const name = this.name();

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot fetch when not in browser context.");

            this.blog.set(PUBLIC_CONFIG.BLOGS.ERROR(this.name(), PUBLIC_CONFIG.FALLBACK_IMAGE_URL, "Cannot fetch when not in browser context."));

            return;
        }

        const request = this.blogService.getBlog(name);

        request.subscribe((response: GetBlogApiEndpointResponse) => {
            if (response.error || response.data === null) {
                this.notificationService.error("Fehler:", "Der Blog konnte nicht geladen werden: " + response.message);

                this.router.navigate(["/"]);

                return;
            }

            this.blog.set(response.data);
        });
    })

    ngOnInit(): void {
        if (typeof this.route.snapshot.params["name"] !== "string") {
            this.notificationService.warn("Kein Titel", "Es konnte kein Blog geladen werden, da kein Titel angegeben wurde.");

            this.router.navigate(["/"]);

            return;
        }

        this.name.set(this.route.snapshot.params["name"]);

        this.route.params.subscribe((params) => {
            const name = params["name"];

            if (typeof name !== "string") {
                this.notificationService.warn("Kein Titel", "Es konnte kein Blog geladen werden, da kein Titel angegeben wurde.");

                this.router.navigate(["/"]);

                return;
            }

            this.name.set(name);
        });
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }
}
