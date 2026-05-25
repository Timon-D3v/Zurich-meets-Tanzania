import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewAccountMembershipDetailsComponent } from "./view-account-membership-details.component";

describe("ViewAccountMembershipDetailsComponent", () => {
    let component: ViewAccountMembershipDetailsComponent;
    let fixture: ComponentFixture<ViewAccountMembershipDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ViewAccountMembershipDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ViewAccountMembershipDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
