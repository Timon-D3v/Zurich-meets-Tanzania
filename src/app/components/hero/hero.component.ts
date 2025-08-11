import { isPlatformBrowser } from "@angular/common";
import { Component, inject, input, PLATFORM_ID } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-hero",
    imports: [RouterLink],
    templateUrl: "./hero.component.html",
    styleUrl: "./hero.component.scss",
    standalone: true,
})
export class HeroComponent {
    title = input.required<string>();

    pictureUrl = input.required<string>();
    pictureAlt = input.required<string>();

    subtitle = input<undefined | string>();

    buttonType = input<undefined | "scroll" | "url">();
    buttonText = input<undefined | string>();
    buttonLink = input<undefined | string>();

    platformId = inject(PLATFORM_ID);

    scrollToInput(): void {
        if (!isPlatformBrowser(this.platformId) || this.buttonLink() === undefined) {
            return;
        }

        const element = document.querySelector(this.buttonLink() as string);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }
}
