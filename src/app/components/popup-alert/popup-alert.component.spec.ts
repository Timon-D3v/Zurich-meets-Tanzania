import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupAlertComponent } from "./popup-alert.component";

describe("PopupAlertComponent", () => {
    let component: PopupAlertComponent;
    let fixture: ComponentFixture<PopupAlertComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupAlertComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupAlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
