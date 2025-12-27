import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatsWebsiteAnalyticsComponent } from "./stats-website-analytics.component";

describe("StatsWebsiteAnalyticsComponent", () => {
    let component: StatsWebsiteAnalyticsComponent;
    let fixture: ComponentFixture<StatsWebsiteAnalyticsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatsWebsiteAnalyticsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatsWebsiteAnalyticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
