import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticSurgeryComponent } from "./edit-static-surgery.component";

describe("EditStaticSurgeryComponent", () => {
    let component: EditStaticSurgeryComponent;
    let fixture: ComponentFixture<EditStaticSurgeryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticSurgeryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticSurgeryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
