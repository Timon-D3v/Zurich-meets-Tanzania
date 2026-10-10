import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DonationRequestComponent } from "./donation-request.component";

describe("DonationRequestComponent", () => {
    let component: DonationRequestComponent;
    let fixture: ComponentFixture<DonationRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationRequestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
