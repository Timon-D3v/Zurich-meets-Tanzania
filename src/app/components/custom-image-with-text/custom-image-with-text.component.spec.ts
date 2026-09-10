import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomImageWithTextComponent } from "./custom-image-with-text.component";

describe("CustomImageWithTextComponent", () => {
    let component: CustomImageWithTextComponent;
    let fixture: ComponentFixture<CustomImageWithTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomImageWithTextComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomImageWithTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
