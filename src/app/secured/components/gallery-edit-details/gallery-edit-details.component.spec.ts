import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GalleryEditDetailsComponent } from "./gallery-edit-details.component";

describe("GalleryEditDetailsComponent", () => {
    let component: GalleryEditDetailsComponent;
    let fixture: ComponentFixture<GalleryEditDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GalleryEditDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GalleryEditDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
