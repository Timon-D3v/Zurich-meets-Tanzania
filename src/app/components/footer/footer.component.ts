import { Component } from "@angular/core";
import { FooterNewsletterSignUpFormComponent } from "../footer-newsletter-sign-up-form/footer-newsletter-sign-up-form.component";
import { RouterLink } from "@angular/router";
import { PUBLIC_CONFIG } from "../../../publicConfig";

@Component({
    selector: "app-footer",
    imports: [FooterNewsletterSignUpFormComponent, RouterLink],
    templateUrl: "./footer.component.html",
    styleUrl: "./footer.component.scss",
})
export class FooterComponent {
    UNIKAT_URL = PUBLIC_CONFIG.UNIKAT_URL;
    FACEBOOK_URL = PUBLIC_CONFIG.FACEBOOK_URL;
    INSTAGRAM_URL = PUBLIC_CONFIG.INSTAGRAM_URL;
    PROGRAMMER_URL = PUBLIC_CONFIG.PROGRAMMER_URL;
}
