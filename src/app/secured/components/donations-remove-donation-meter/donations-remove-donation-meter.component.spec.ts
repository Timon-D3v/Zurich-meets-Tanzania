import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsRemoveDonationMeterComponent } from "./donations-remove-donation-meter.component";

describe("DonationsRemoveDonationmeterComponent", () => {
    let component: DonationsRemoveDonationMeterComponent;
    let fixture: ComponentFixture<DonationsRemoveDonationMeterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationsRemoveDonationMeterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationsRemoveDonationMeterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
