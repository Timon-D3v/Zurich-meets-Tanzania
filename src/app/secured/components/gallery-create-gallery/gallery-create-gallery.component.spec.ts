import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GalleryCreateGalleryComponent } from "./gallery-create-gallery.component";

describe("GalleryCreateGalleryComponent", () => {
    let component: GalleryCreateGalleryComponent;
    let fixture: ComponentFixture<GalleryCreateGalleryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GalleryCreateGalleryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryCreateGalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
