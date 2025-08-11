import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CurrentTeam } from "./current-team";

describe("CurrentTeam", () => {
    let component: CurrentTeam;
    let fixture: ComponentFixture<CurrentTeam>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CurrentTeam],
        }).compileComponents();

        fixture = TestBed.createComponent(CurrentTeam);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
