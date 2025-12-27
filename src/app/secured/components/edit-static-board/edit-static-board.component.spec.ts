import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticBoardComponent } from "./edit-static-board.component";

describe("EditStaticBoardComponent", () => {
    let component: EditStaticBoardComponent;
    let fixture: ComponentFixture<EditStaticBoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticBoardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
