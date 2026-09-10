import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationMeterBannerComponent } from "./donation-meter-banner.component";

describe("DonationMeterBannerComponent", () => {
    let component: DonationMeterBannerComponent;
    let fixture: ComponentFixture<DonationMeterBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationMeterBannerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationMeterBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
