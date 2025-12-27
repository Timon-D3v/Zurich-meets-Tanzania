import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GalleryRemoveImagesComponent } from "./gallery-remove-images.component";

describe("GalleryRemoveImagesComponent", () => {
    let component: GalleryRemoveImagesComponent;
    let fixture: ComponentFixture<GalleryRemoveImagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GalleryRemoveImagesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryRemoveImagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
