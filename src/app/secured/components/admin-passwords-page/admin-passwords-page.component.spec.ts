import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminPasswordsPageComponent } from "./admin-passwords-page.component";

describe("AdminPasswordsPageComponent", () => {
    let component: AdminPasswordsPageComponent;
    let fixture: ComponentFixture<AdminPasswordsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminPasswordsPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminPasswordsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
