import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomMultipleButtonsComponent } from "./custom-multiple-buttons.component";

describe("CustomMultipleButtonsComponent", () => {
    let component: CustomMultipleButtonsComponent;
    let fixture: ComponentFixture<CustomMultipleButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomMultipleButtonsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomMultipleButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
