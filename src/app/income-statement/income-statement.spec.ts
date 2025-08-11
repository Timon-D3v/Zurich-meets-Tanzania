import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IncomeStatement } from "./income-statement";

describe("IncomeStatement", () => {
    let component: IncomeStatement;
    let fixture: ComponentFixture<IncomeStatement>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IncomeStatement],
        }).compileComponents();

        fixture = TestBed.createComponent(IncomeStatement);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
