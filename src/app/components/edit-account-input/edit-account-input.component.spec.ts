import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditAccountInputComponent } from "./edit-account-input.component";

describe("EditAccountInputComponent", () => {
    let component: EditAccountInputComponent;
    let fixture: ComponentFixture<EditAccountInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditAccountInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditAccountInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
