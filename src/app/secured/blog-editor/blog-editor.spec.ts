import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlogEditor } from "./blog-editor";

describe("BlogEditor", () => {
    let component: BlogEditor;
    let fixture: ComponentFixture<BlogEditor>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogEditor],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogEditor);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
