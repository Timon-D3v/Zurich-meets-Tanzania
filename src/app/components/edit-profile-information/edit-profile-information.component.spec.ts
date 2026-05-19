import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditProfileInformationComponent } from "./edit-profile-information.component";

describe("EditProfileInformationComponent", () => {
    let component: EditProfileInformationComponent;
    let fixture: ComponentFixture<EditProfileInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditProfileInformationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditProfileInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
