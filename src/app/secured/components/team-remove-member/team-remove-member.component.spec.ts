import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TeamRemoveMemberComponent } from "./team-remove-member.component";

describe("TeamRemoveMemberComponent", () => {
    let component: TeamRemoveMemberComponent;
    let fixture: ComponentFixture<TeamRemoveMemberComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TeamRemoveMemberComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TeamRemoveMemberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
