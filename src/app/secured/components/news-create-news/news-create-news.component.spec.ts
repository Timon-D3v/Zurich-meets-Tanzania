import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsCreateNewsComponent } from "./news-create-news.component";

describe("NewsCreateNewsComponent", () => {
    let component: NewsCreateNewsComponent;
    let fixture: ComponentFixture<NewsCreateNewsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsCreateNewsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsCreateNewsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
