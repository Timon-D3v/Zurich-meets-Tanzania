import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsCreateDonationMeterComponent } from "./donations-create-donation-meter.component";

describe("DonationsCreateDonationMeterComponent", () => {
    let component: DonationsCreateDonationMeterComponent;
    let fixture: ComponentFixture<DonationsCreateDonationMeterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationsCreateDonationMeterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationsCreateDonationMeterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
