import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Meducation } from "./meducation";

describe("Meducation", () => {
    let component: Meducation;
    let fixture: ComponentFixture<Meducation>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Meducation],
        }).compileComponents();

        fixture = TestBed.createComponent(Meducation);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
