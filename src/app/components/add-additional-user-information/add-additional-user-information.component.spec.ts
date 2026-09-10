import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddAdditionalUserInformationComponent } from "./add-additional-user-information.component";

describe("AddAdditionalUserInformationComponent", () => {
    let component: AddAdditionalUserInformationComponent;
    let fixture: ComponentFixture<AddAdditionalUserInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddAdditionalUserInformationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddAdditionalUserInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
