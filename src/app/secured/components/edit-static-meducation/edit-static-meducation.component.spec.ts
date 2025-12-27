import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticMeducationComponent } from "./edit-static-meducation.component";

describe("EditStaticMeducationComponent", () => {
    let component: EditStaticMeducationComponent;
    let fixture: ComponentFixture<EditStaticMeducationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticMeducationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticMeducationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
