import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlogBuilder } from "./blog-builder";

describe("BlogBuilder", () => {
    let component: BlogBuilder;
    let fixture: ComponentFixture<BlogBuilder>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlogBuilder],
        }).compileComponents();

        fixture = TestBed.createComponent(BlogBuilder);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
