import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminFileExplorerComponent } from "./admin-file-explorer.component";

describe("AdminFileExplorerComponent", () => {
    let component: AdminFileExplorerComponent;
    let fixture: ComponentFixture<AdminFileExplorerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminFileExplorerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminFileExplorerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
