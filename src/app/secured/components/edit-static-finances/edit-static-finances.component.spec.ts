import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticFinancesComponent } from "./edit-static-finances.component";

describe("EditStaticFinancesComponent", () => {
    let component: EditStaticFinancesComponent;
    let fixture: ComponentFixture<EditStaticFinancesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticFinancesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticFinancesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
