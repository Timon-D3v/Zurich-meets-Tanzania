import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomSubtitleComponent } from "./custom-subtitle.component";

describe("CustomSubtitleComponent", () => {
    let component: CustomSubtitleComponent;
    let fixture: ComponentFixture<CustomSubtitleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomSubtitleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomSubtitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
