import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupMultipleButtonsInputComponent } from "./popup-multiple-buttons-input.component";

describe("PopupMultipleButtonsInputComponent", () => {
    let component: PopupMultipleButtonsInputComponent;
    let fixture: ComponentFixture<PopupMultipleButtonsInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupMultipleButtonsInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupMultipleButtonsInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
