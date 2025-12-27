import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticVisionComponent } from "./edit-static-vision.component";

describe("EditStaticVisionComponent", () => {
    let component: EditStaticVisionComponent;
    let fixture: ComponentFixture<EditStaticVisionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticVisionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticVisionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
