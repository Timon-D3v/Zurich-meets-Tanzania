import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticBeginningComponent } from "./edit-static-beginning.component";

describe("EditStaticBeginningComponent", () => {
    let component: EditStaticBeginningComponent;
    let fixture: ComponentFixture<EditStaticBeginningComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticBeginningComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticBeginningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
