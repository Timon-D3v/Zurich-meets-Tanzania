import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CalendarDeleteEventComponent } from "./calendar-delete-event.component";

describe("CalendarDeleteEventComponent", () => {
    let component: CalendarDeleteEventComponent;
    let fixture: ComponentFixture<CalendarDeleteEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarDeleteEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CalendarDeleteEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
