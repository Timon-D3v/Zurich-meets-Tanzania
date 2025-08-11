import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Cardiology } from "./cardiology";

describe("Cardiology", () => {
    let component: Cardiology;
    let fixture: ComponentFixture<Cardiology>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Cardiology],
        }).compileComponents();

        fixture = TestBed.createComponent(Cardiology);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
