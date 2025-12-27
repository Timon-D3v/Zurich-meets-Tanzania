import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsPushDonationMeterComponent } from "./donations-push-donation-meter.component";

describe("DonationsPushDonationmeterComponent", () => {
    let component: DonationsPushDonationMeterComponent;
    let fixture: ComponentFixture<DonationsPushDonationMeterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationsPushDonationMeterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationsPushDonationMeterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
