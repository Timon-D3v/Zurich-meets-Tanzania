import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticIncomeStatementComponent } from "./edit-static-income-statement.component";

describe("EditStaticIncomeStatementComponent", () => {
    let component: EditStaticIncomeStatementComponent;
    let fixture: ComponentFixture<EditStaticIncomeStatementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticIncomeStatementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticIncomeStatementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
