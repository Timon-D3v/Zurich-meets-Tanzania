import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlogBuilderComponent } from "./blog-builder.component";

describe("BlogBuilderComponent", () => {
    let component: BlogBuilderComponent;
    let fixture: ComponentFixture<BlogBuilderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogBuilderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
