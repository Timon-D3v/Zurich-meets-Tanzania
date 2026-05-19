import { Component, input, OnInit, signal } from "@angular/core";
import { PublicUser } from "../../..";
import { EditProfileInputComponent } from "../edit-profile-input/edit-profile-input.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-edit-profile-information",
    imports: [EditProfileInputComponent, ReactiveFormsModule],
    templateUrl: "./edit-profile-information.component.html",
    styleUrl: "./edit-profile-information.component.scss",
})
export class EditProfileInformationComponent implements OnInit {
    submitButtonDisabled = signal(true);
    submitButtonText = signal("Speichern");

    user = input.required<PublicUser>();

    editProfileForm = new FormGroup({
        emailControl: new FormControl(""),
    });

    ngOnInit(): void {
        this.editProfileForm.patchValue({
            emailControl: this.user().email,
        });
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        console.log("Form submitted!", event);
    }

    updateEmailInput(event: string | number | object | null) {
        if (typeof event === "string") {
            this.editProfileForm.patchValue({
                emailControl: event,
            });
        } else {
            console.warn("Received non-string value for email input:", event);
        }
    }
}
