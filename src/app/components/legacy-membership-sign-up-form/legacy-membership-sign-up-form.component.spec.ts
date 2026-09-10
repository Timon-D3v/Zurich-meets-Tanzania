import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LegacyMembershipSignUpFormComponent } from "./legacy-membership-sign-up-form.component";

describe("LegacyMembershipSignUpFormComponent", () => {
    let component: LegacyMembershipSignUpFormComponent;
    let fixture: ComponentFixture<LegacyMembershipSignUpFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LegacyMembershipSignUpFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LegacyMembershipSignUpFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
