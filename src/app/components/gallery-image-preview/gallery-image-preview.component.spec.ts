import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GalleryImagePreviewComponent } from "./gallery-image-preview.component";

describe("GalleryImagePreviewComponent", () => {
    let component: GalleryImagePreviewComponent;
    let fixture: ComponentFixture<GalleryImagePreviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GalleryImagePreviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryImagePreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
