import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditAccountSelectInputComponent } from "./edit-account-select-input.component";

describe("EditAccountSelectInputComponent", () => {
    let component: EditAccountSelectInputComponent;
    let fixture: ComponentFixture<EditAccountSelectInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditAccountSelectInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditAccountSelectInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
