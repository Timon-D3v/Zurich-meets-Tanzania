import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditProfileInputComponent } from "./edit-profile-input.component";

describe("EditProfileInputComponent", () => {
    let component: EditProfileInputComponent;
    let fixture: ComponentFixture<EditProfileInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditProfileInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditProfileInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
