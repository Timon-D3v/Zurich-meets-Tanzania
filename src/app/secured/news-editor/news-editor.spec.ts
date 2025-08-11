import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewsEditor } from "./news-editor";

describe("NewsEditor", () => {
    let component: NewsEditor;
    let fixture: ComponentFixture<NewsEditor>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsEditor],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsEditor);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
