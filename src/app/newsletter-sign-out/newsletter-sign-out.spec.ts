import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsletterSignOut } from "./newsletter-sign-out";

describe("NewsletterSignOut", () => {
    let component: NewsletterSignOut;
    let fixture: ComponentFixture<NewsletterSignOut>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsletterSignOut],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsletterSignOut);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
