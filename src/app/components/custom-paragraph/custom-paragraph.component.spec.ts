import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomParagraphComponent } from "./custom-paragraph.component";

describe("CustomParagraphComponent", () => {
    let component: CustomParagraphComponent;
    let fixture: ComponentFixture<CustomParagraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomParagraphComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomParagraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
