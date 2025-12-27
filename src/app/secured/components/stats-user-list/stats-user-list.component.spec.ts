import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatsUserListComponent } from "./stats-user-list.component";

describe("StatsUserListComponent", () => {
    let component: StatsUserListComponent;
    let fixture: ComponentFixture<StatsUserListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatsUserListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatsUserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
