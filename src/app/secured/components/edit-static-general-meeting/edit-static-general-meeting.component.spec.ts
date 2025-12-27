import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditStaticGeneralMeetingComponent } from "./edit-static-general-meeting.component";

describe("EditStaticGeneralMeetingComponent", () => {
    let component: EditStaticGeneralMeetingComponent;
    let fixture: ComponentFixture<EditStaticGeneralMeetingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditStaticGeneralMeetingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditStaticGeneralMeetingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
