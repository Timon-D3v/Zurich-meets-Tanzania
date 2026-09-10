import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupMultipleListsInputComponent } from "./popup-multiple-lists-input.component";

describe("PopupMultipleListsInputComponent", () => {
    let component: PopupMultipleListsInputComponent;
    let fixture: ComponentFixture<PopupMultipleListsInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupMultipleListsInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupMultipleListsInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
