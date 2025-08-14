import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatutesComponent } from "./statutes.component";

describe("StatutesComponent", () => {
    let component: StatutesComponent;
    let fixture: ComponentFixture<StatutesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatutesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatutesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
