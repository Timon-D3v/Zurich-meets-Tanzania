import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ZurichMeetsTanzania } from "./zurich-meets-tanzania";

describe("ZurichMeetsTanzania", () => {
    let component: ZurichMeetsTanzania;
    let fixture: ComponentFixture<ZurichMeetsTanzania>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZurichMeetsTanzania],
        }).compileComponents();

        fixture = TestBed.createComponent(ZurichMeetsTanzania);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
