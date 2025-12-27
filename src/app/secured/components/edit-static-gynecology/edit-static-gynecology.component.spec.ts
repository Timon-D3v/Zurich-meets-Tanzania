import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticGynecologyComponent } from "./edit-static-gynecology.component";

describe("EditStaticGynecologyComponent", () => {
    let component: EditStaticGynecologyComponent;
    let fixture: ComponentFixture<EditStaticGynecologyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticGynecologyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticGynecologyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
