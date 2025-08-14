import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GeneralMeetingComponent } from "./general-meeting.component";

describe("GeneralMeetingComponent", () => {
    let component: GeneralMeetingComponent;
    let fixture: ComponentFixture<GeneralMeetingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GeneralMeetingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralMeetingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
