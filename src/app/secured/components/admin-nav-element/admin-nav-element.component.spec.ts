import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminNavElementComponent } from "./admin-nav-element.component";

describe("AdminNavElements", () => {
    let component: AdminNavElementComponent;
    let fixture: ComponentFixture<AdminNavElementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminNavElementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminNavElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
