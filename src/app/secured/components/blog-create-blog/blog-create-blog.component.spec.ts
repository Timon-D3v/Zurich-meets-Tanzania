import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlogCreateBlogComponent } from "./blog-create-blog.component";

describe("BlogCreateBlogComponent", () => {
    let component: BlogCreateBlogComponent;
    let fixture: ComponentFixture<BlogCreateBlogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogCreateBlogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogCreateBlogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
