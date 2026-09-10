import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TeamCreateTeamComponent } from "./team-create-team.component";

describe("TeamCreateTeamComponent", () => {
    let component: TeamCreateTeamComponent;
    let fixture: ComponentFixture<TeamCreateTeamComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TeamCreateTeamComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TeamCreateTeamComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
