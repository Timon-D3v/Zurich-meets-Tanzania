import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PasswordRecoveryConfirmComponent } from "./password-recovery-confirm.component";

describe("PasswordRecoveryConfirmComponent", () => {
    let component: PasswordRecoveryConfirmComponent;
    let fixture: ComponentFixture<PasswordRecoveryConfirmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PasswordRecoveryConfirmComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PasswordRecoveryConfirmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
