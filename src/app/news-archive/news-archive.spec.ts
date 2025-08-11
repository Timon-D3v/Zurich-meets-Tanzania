import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsArchive } from "./news-archive";

describe("NewsArchive", () => {
    let component: NewsArchive;
    let fixture: ComponentFixture<NewsArchive>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsArchive],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsArchive);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
