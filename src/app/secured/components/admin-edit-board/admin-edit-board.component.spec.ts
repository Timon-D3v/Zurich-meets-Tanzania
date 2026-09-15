import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminEditBoardComponent } from "./admin-edit-board.component";

describe("AdminEditBoardComponent", () => {
    let component: AdminEditBoardComponent;
    let fixture: ComponentFixture<AdminEditBoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminEditBoardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminEditBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
