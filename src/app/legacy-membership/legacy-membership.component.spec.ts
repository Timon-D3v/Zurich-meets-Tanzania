import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LegacyMembershipComponent } from "./legacy-membership.component";

describe("LegacyMembershipComponent", () => {
    let component: LegacyMembershipComponent;
    let fixture: ComponentFixture<LegacyMembershipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LegacyMembershipComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LegacyMembershipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
