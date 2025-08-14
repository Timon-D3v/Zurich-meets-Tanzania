import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ZurichMeetsTanzaniaComponent } from "./zurich-meets-tanzania.component";

describe("ZurichMeetsTanzaniaComponent", () => {
    let component: ZurichMeetsTanzaniaComponent;
    let fixture: ComponentFixture<ZurichMeetsTanzaniaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZurichMeetsTanzaniaComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZurichMeetsTanzaniaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
