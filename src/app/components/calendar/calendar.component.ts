import { Component, input } from "@angular/core";
import { CalendarEvent } from "../../..";
import { CalendarItemComponent } from "../calendar-item/calendar-item.component";
import { LoadingComponent } from "../loading/loading.component";

@Component({
    selector: "app-calendar",
    imports: [CalendarItemComponent, LoadingComponent],
    templateUrl: "./calendar.component.html",
    styleUrl: "./calendar.component.scss",
})
export class CalendarComponent {
    events = input<CalendarEvent[]>([]);
}
