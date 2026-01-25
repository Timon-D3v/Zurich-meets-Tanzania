import { Component, input } from "@angular/core";
import { TeamMember } from "../../..";
import { TeamMemberComponent } from "../team-member/team-member.component";

@Component({
    selector: "app-team",
    imports: [TeamMemberComponent],
    templateUrl: "./team.component.html",
    styleUrl: "./team.component.scss",
})
export class TeamComponent {
    team = input.required<TeamMember[]>();
}
