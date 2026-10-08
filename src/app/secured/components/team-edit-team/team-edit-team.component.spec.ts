import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TeamEditTeamComponent } from "./team-edit-team.component";

describe("TeamEditTeamComponent", () => {
    let component: TeamEditTeamComponent;
    let fixture: ComponentFixture<TeamEditTeamComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TeamEditTeamComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TeamEditTeamComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
