import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MembershipSignUpFormComponent } from "./membership-sign-up-form.component";

describe("MembershipSignUpFormComponent", () => {
    let component: MembershipSignUpFormComponent;
    let fixture: ComponentFixture<MembershipSignUpFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembershipSignUpFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MembershipSignUpFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
