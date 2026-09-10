import { Component, input, signal } from "@angular/core";

@Component({
    selector: "app-custom-image-carousel",
    imports: [],
    templateUrl: "./custom-image-carousel.component.html",
    styleUrl: "./custom-image-carousel.component.scss",
})
export class CustomImageCarouselComponent {
    images = input.required<{ imageUrl: string; imageAlt: string }[]>();

    currentIndex = signal<number>(0);

    nextImage() {
        this.currentIndex.update((index: number) => {
            if (index + 1 === this.images().length) {
                return 0;
            }

            return index + 1;
        });
    }

    previousImage() {
        this.currentIndex.update((index: number) => {
            if (index - 1 === -1) {
                return this.images().length - 1;
            }

            return index - 1;
        });
    }

    setImage(index: number) {
        this.currentIndex.set(index);
    }
}
