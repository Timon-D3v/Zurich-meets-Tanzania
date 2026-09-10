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
    role = input<string | null>(null);
    profession = input.required<string>();
    motive = input.required<string>();
    imageUrl = input.required<string>();
    secondaryImageUrl = input<string | null>(null);

    isOpen = signal<boolean>(false);

    toggle(): void {
        this.isOpen.update((value) => !value);
    }
}
