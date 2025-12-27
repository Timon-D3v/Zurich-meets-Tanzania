import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsAllTimeDonationsListComponent } from "./donations-all-time-donations-list.component";

describe("DonationsAllTimeDonationsListComponent", () => {
    let component: DonationsAllTimeDonationsListComponent;
    let fixture: ComponentFixture<DonationsAllTimeDonationsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationsAllTimeDonationsListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationsAllTimeDonationsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
