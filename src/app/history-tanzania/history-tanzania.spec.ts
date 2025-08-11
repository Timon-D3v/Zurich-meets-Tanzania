import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HistoryTanzania } from "./history-tanzania";

describe("HistoryTanzania", () => {
    let component: HistoryTanzania;
    let fixture: ComponentFixture<HistoryTanzania>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HistoryTanzania],
        }).compileComponents();

        fixture = TestBed.createComponent(HistoryTanzania);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
