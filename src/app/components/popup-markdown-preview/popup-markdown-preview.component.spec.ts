import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupMarkdownPreviewComponent } from "./popup-markdown-preview.component";

describe("PopupMarkdownPreviewComponent", () => {
    let component: PopupMarkdownPreviewComponent;
    let fixture: ComponentFixture<PopupMarkdownPreviewComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupMarkdownPreviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupMarkdownPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
