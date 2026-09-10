import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsletterSignOutComponent } from "./newsletter-sign-out.component";

describe("NewsletterSignOutComponent", () => {
    let component: NewsletterSignOutComponent;
    let fixture: ComponentFixture<NewsletterSignOutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsletterSignOutComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsletterSignOutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
