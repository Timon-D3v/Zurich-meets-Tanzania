import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PaymentResponseComponent } from "./payment-response.component";

describe("PaymentResponseComponent", () => {
    let component: PaymentResponseComponent;
    let fixture: ComponentFixture<PaymentResponseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaymentResponseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PaymentResponseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
