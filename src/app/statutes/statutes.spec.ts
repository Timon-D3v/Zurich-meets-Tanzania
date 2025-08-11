import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Statutes } from "./statutes";

describe("Statutes", () => {
    let component: Statutes;
    let fixture: ComponentFixture<Statutes>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Statutes],
        }).compileComponents();

        fixture = TestBed.createComponent(Statutes);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
