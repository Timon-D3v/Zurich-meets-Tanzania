import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MembersAddManualMemberComponent } from "./members-add-manual-member.component";

describe("MembersAddManualMemberComponent", () => {
    let component: MembersAddManualMemberComponent;
    let fixture: ComponentFixture<MembersAddManualMemberComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembersAddManualMemberComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MembersAddManualMemberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
