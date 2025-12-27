import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticStatutesComponent } from "./edit-static-statutes.component";

describe("EditStaticStatutesComponent", () => {
    let component: EditStaticStatutesComponent;
    let fixture: ComponentFixture<EditStaticStatutesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticStatutesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticStatutesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
