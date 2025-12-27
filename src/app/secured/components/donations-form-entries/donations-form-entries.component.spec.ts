import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsFormEntriesComponent } from "./donations-form-entries.component";

describe("DonationsFormEntriesComponent", () => {
    let component: DonationsFormEntriesComponent;
    let fixture: ComponentFixture<DonationsFormEntriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationsFormEntriesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationsFormEntriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
