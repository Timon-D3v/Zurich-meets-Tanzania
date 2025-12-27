import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MembersRemoveManualMemberComponent } from "./members-remove-manual-member.component";

describe("MembersRemoveManualMemberComponent", () => {
    let component: MembersRemoveManualMemberComponent;
    let fixture: ComponentFixture<MembersRemoveManualMemberComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembersRemoveManualMemberComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MembersRemoveManualMemberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
