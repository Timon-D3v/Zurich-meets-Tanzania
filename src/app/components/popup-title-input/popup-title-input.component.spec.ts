import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupTitleInputComponent } from "./popup-title-input.component";

describe("PopupTitleInputComponent", () => {
    let component: PopupTitleInputComponent;
    let fixture: ComponentFixture<PopupTitleInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupTitleInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupTitleInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
