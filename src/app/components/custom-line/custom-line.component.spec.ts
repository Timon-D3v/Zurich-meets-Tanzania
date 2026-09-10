import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomLineComponent } from "./custom-line.component";

describe("CustomLineComponent", () => {
    let component: CustomLineComponent;
    let fixture: ComponentFixture<CustomLineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomLineComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
