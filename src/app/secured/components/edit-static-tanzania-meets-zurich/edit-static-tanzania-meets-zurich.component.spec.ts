import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticTanzaniaMeetsZurichComponent } from "./edit-static-tanzania-meets-zurich.component";

describe("EditStaticTanzaniaMeetsZurichComponent", () => {
    let component: EditStaticTanzaniaMeetsZurichComponent;
    let fixture: ComponentFixture<EditStaticTanzaniaMeetsZurichComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticTanzaniaMeetsZurichComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticTanzaniaMeetsZurichComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
