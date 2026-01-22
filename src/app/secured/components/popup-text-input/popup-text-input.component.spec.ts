import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupTextInputComponent } from "./popup-text-input.component";

describe("PopupTextInputComponent", () => {
    let component: PopupTextInputComponent;
    let fixture: ComponentFixture<PopupTextInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupTextInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupTextInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
