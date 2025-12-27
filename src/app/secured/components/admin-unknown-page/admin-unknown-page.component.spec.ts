import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminUnknownPageComponent } from "./admin-unknown-page.component";

describe("AdminUnknownPageComponent", () => {
    let component: AdminUnknownPageComponent;
    let fixture: ComponentFixture<AdminUnknownPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminUnknownPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminUnknownPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
