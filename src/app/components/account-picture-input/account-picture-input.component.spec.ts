import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccountPictureInputComponent } from "./account-picture-input.component";

describe("AccountPictureInputComponent", () => {
    let component: AccountPictureInputComponent;
    let fixture: ComponentFixture<AccountPictureInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountPictureInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountPictureInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
