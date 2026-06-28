import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationAmountInputComponent } from "./donation-amount-input.component";

describe("DonationAmountInputComponent", () => {
    let component: DonationAmountInputComponent;
    let fixture: ComponentFixture<DonationAmountInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationAmountInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationAmountInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
