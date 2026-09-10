import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsEditNewsComponent } from "./news-edit-news.component";

describe("NewsEditNewsComponent", () => {
    let component: NewsEditNewsComponent;
    let fixture: ComponentFixture<NewsEditNewsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsEditNewsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsEditNewsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
