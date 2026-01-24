import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupConfirmComponent } from "./popup-confirm.component";

describe("PopupConfirmComponent", () => {
    let component: PopupConfirmComponent;
    let fixture: ComponentFixture<PopupConfirmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupConfirmComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupConfirmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
