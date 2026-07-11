import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomSourceComponent } from "./custom-source.component";

describe("CustomSourceComponent", () => {
    let component: CustomSourceComponent;
    let fixture: ComponentFixture<CustomSourceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomSourceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomSourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
