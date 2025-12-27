import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsCreateShopItemComponent } from "./donations-create-shop-item.component";

describe("DonationsCreateShopItemComponent", () => {
    let component: DonationsCreateShopItemComponent;
    let fixture: ComponentFixture<DonationsCreateShopItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationsCreateShopItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationsCreateShopItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
