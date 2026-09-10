import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FooterNewsletterSignUpFormComponent } from "./footer-newsletter-sign-up-form.component";

describe("FooterNewsletterSignUpFormComponent", () => {
    let component: FooterNewsletterSignUpFormComponent;
    let fixture: ComponentFixture<FooterNewsletterSignUpFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterNewsletterSignUpFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FooterNewsletterSignUpFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
