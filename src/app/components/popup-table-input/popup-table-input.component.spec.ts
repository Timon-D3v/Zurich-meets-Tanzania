import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupTableInputComponent } from "./popup-table-input.component";

describe("PopupTableInputComponent", () => {
    let component: PopupTableInputComponent;
    let fixture: ComponentFixture<PopupTableInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupTableInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupTableInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
