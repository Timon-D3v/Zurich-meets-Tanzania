import { Component, input, signal } from "@angular/core";

@Component({
    selector: "app-team-member",
    imports: [],
    templateUrl: "./team-member.component.html",
    styleUrl: "./team-member.component.scss",
})
export class TeamMemberComponent {
    firstName = input.required<string>();
    lastName = input.required<string>();
    job = input.required<string>();
    motivation = input.required<string>();
    imageUrl = input.required<string>();

    isOpen = signal<boolean>(false);

    toggle(): void {
        this.isOpen.update((value) => !value);
    }
}
