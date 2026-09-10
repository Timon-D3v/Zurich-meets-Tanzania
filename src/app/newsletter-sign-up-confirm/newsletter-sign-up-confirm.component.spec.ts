import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsletterSignUpConfirmComponent } from "./newsletter-sign-up-confirm.component";

describe("NewsletterSignUpConfirmComponent", () => {
    let component: NewsletterSignUpConfirmComponent;
    let fixture: ComponentFixture<NewsletterSignUpConfirmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsletterSignUpConfirmComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsletterSignUpConfirmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
