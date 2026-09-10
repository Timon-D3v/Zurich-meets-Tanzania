import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CalendarCreateEventComponent } from "./calendar-create-event.component";

describe("CalendarCreateEventComponent", () => {
    let component: CalendarCreateEventComponent;
    let fixture: ComponentFixture<CalendarCreateEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarCreateEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarCreateEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
