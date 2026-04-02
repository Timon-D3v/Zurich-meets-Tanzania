import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlogPreviewItemComponent } from "./blog-preview-item.component";

describe("BlogPreviewItemComponent", () => {
    let component: BlogPreviewItemComponent;
    let fixture: ComponentFixture<BlogPreviewItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogPreviewItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogPreviewItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
