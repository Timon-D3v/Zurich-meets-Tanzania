import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomImageCarouselComponent } from "./custom-image-carousel.component";

describe("CustomImageCarouselComponent", () => {
    let component: CustomImageCarouselComponent;
    let fixture: ComponentFixture<CustomImageCarouselComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomImageCarouselComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomImageCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
