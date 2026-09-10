import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GalleryAddImagesComponent } from "./gallery-add-images.component";

describe("GalleryAddImagesComponent", () => {
    let component: GalleryAddImagesComponent;
    let fixture: ComponentFixture<GalleryAddImagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GalleryAddImagesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryAddImagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
