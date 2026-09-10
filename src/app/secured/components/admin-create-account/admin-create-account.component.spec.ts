import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminCreateAccountComponent } from "./admin-create-account.component";

describe("AdminCreateAccountComponent", () => {
    let component: AdminCreateAccountComponent;
    let fixture: ComponentFixture<AdminCreateAccountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminCreateAccountComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminCreateAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
