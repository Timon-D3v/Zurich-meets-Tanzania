import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupConfirmInputComponent } from "./popup-confirm-input.component";

describe("PopupConfirmInputComponent", () => {
    let component: PopupConfirmInputComponent;
    let fixture: ComponentFixture<PopupConfirmInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupConfirmInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupConfirmInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
