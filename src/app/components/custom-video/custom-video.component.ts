import { Component, input, signal, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { getRandomHexString } from "../../../shared/utils";

@Component({
    selector: "app-custom-video",
    imports: [],
    templateUrl: "./custom-video.component.html",
    styleUrl: "./custom-video.component.scss",
})
export class CustomVideoComponent {
    videoUrl = input.required<string>();
    videoType = input.required<string>();

    controlsVisible = signal<boolean>(false);

    id = getRandomHexString(32);

    private platformId = inject(PLATFORM_ID);

    startVideo() {
        this.controlsVisible.set(true);

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot start video when not in browser context.");
            return;
        }

        const videoElement = document.getElementById(this.id) as HTMLVideoElement | null;

        if (videoElement) {
            videoElement.play().catch((error) => {
                console.error("Error playing video:", error);
            });
        } else {
            console.error("Video element not found.");
        }
    }

    pauseVideo() {
        this.controlsVisible.set(false);
    }
}
