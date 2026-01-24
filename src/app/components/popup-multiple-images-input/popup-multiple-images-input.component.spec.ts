import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupMultipleImagesInputComponent } from "./popup-multiple-images-input.component";

describe("PopupMultipleImagesInputComponent", () => {
    let component: PopupMultipleImagesInputComponent;
    let fixture: ComponentFixture<PopupMultipleImagesInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupMultipleImagesInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupMultipleImagesInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
