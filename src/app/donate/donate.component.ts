import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { HeroComponent } from "../components/hero/hero.component";
import { DonationFormComponent } from "../components/donation-form/donation-form.component";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-donate",
    imports: [HeroComponent, DonationFormComponent],
    templateUrl: "./donate.component.html",
    styleUrl: "./donate.component.scss",
})
export class DonateComponent implements OnInit {
    elementToScrollTo = "#scrollToDonate";

    platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.scroll();
    }

    scroll(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const element = document.querySelector(this.elementToScrollTo);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }
}
