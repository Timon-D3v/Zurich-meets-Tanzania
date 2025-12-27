import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticHistoryComponent } from "./edit-static-history.component";

describe("EditStaticHistoryComponent", () => {
    let component: EditStaticHistoryComponent;
    let fixture: ComponentFixture<EditStaticHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticHistoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
