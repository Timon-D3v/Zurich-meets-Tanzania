import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlogEditBlogComponent } from "./blog-edit-blog.component";

describe("BlogEditBlogComponent", () => {
    let component: BlogEditBlogComponent;
    let fixture: ComponentFixture<BlogEditBlogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogEditBlogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogEditBlogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
