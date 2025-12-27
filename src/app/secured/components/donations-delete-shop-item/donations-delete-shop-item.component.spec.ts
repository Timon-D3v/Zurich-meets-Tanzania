import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsDeleteShopItemComponent } from "./donations-delete-shop-item.component";

describe("DonationsDeleteShopItemComponent", () => {
    let component: DonationsDeleteShopItemComponent;
    let fixture: ComponentFixture<DonationsDeleteShopItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DonationsDeleteShopItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DonationsDeleteShopItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
