import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticCardiologyComponent } from "./edit-static-cardiology.component";

describe("EditStaticCardiologyComponent", () => {
    let component: EditStaticCardiologyComponent;
    let fixture: ComponentFixture<EditStaticCardiologyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticCardiologyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticCardiologyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
