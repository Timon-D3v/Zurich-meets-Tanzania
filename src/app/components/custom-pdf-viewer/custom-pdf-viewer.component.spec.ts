import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomPdfViewerComponent } from "./custom-pdf-viewer.component";

describe("CustomPdfViewerComponent", () => {
    let component: CustomPdfViewerComponent;
    let fixture: ComponentFixture<CustomPdfViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomPdfViewerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomPdfViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
