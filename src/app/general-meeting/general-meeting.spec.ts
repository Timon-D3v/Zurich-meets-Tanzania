import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GeneralMeeting } from "./general-meeting";

describe("GeneralMeeting", () => {
    let component: GeneralMeeting;
    let fixture: ComponentFixture<GeneralMeeting>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GeneralMeeting],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralMeeting);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
