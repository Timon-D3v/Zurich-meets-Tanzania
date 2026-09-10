import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupFileInputComponent } from "./popup-file-input.component";

describe("PopupFileInputComponent", () => {
    let component: PopupFileInputComponent;
    let fixture: ComponentFixture<PopupFileInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupFileInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupFileInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
