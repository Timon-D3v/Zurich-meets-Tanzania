import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsBuilder } from "./news-builder";

describe("NewsBuilder", () => {
    let component: NewsBuilder;
    let fixture: ComponentFixture<NewsBuilder>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsBuilder],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsBuilder);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
