import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GalleryDeleteGalleryComponent } from "./gallery-delete-gallery.component";

describe("GalleryDeleteGalleryComponent", () => {
    let component: GalleryDeleteGalleryComponent;
    let fixture: ComponentFixture<GalleryDeleteGalleryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GalleryDeleteGalleryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryDeleteGalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
