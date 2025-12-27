import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticMbuziComponent } from "./edit-static-mbuzi.component";

describe("EditStaticMbuziComponent", () => {
    let component: EditStaticMbuziComponent;
    let fixture: ComponentFixture<EditStaticMbuziComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticMbuziComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticMbuziComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
