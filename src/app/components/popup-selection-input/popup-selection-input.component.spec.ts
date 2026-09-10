import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupSelectionInputComponent } from "./popup-selection-input.component";

describe("PopupSelectionInputComponent", () => {
    let component: PopupSelectionInputComponent;
    let fixture: ComponentFixture<PopupSelectionInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupSelectionInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupSelectionInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
