import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddBoardInformationComponent } from "./add-board-information.component";

describe("AddBoardInformationComponent", () => {
    let component: AddBoardInformationComponent;
    let fixture: ComponentFixture<AddBoardInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddBoardInformationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddBoardInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
