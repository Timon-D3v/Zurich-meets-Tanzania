import { Component, effect, inject, signal } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { PublicUser } from "../..";

@Component({
    selector: "app-account",
    imports: [],
    templateUrl: "./account.component.html",
    styleUrl: "./account.component.scss",
})
export class AccountComponent {
    user = signal<PublicUser>({
        email: "Laden...",
        firstName: "Laden...",
        lastName: "Laden...",
        phone: "Laden...",
        address: "Laden...",
        type: "user",
        picture: "/svg/personal.svg",
    });

    bannerId = signal<number>(this.getRandomInt(1, 10));

    private authService = inject(AuthService);

    private _updateUserObject = effect(() => {
        const userObject = this.authService.user();

        if (userObject === null) {
            this.user.set({
                email: "Laden...",
                firstName: "Laden...",
                lastName: "Laden...",
                phone: "Laden...",
                address: "Laden...",
                type: "user",
                picture: "/svg/personal.svg",
            });
        } else {
            this.user.set(userObject);
        }
    });

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
