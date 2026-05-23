import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditAccountInformationComponent } from "./edit-account-information.component";

describe("EditAccountInformationComponent", () => {
    let component: EditAccountInformationComponent;
    let fixture: ComponentFixture<EditAccountInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditAccountInformationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditAccountInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
