import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GalleryEditImagesComponent } from "./gallery-edit-images.component";

describe("GalleryEditImagesComponent", () => {
    let component: GalleryEditImagesComponent;
    let fixture: ComponentFixture<GalleryEditImagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GalleryEditImagesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryEditImagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
