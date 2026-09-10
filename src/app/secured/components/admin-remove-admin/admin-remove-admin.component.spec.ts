import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminRemoveAdminComponent } from "./admin-remove-admin.component";

describe("AdminRemoveAdminComponent", () => {
    let component: AdminRemoveAdminComponent;
    let fixture: ComponentFixture<AdminRemoveAdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminRemoveAdminComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminRemoveAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
