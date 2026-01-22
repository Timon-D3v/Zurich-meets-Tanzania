import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupImageInputComponent } from "./popup-image-input.component";

describe("PopupImageInputComponent", () => {
    let component: PopupImageInputComponent;
    let fixture: ComponentFixture<PopupImageInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupImageInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupImageInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
