import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminAddAdminComponent } from "./admin-add-admin.component";

describe("AdminAddAdminComponent", () => {
    let component: AdminAddAdminComponent;
    let fixture: ComponentFixture<AdminAddAdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminAddAdminComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminAddAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
