import { Component, input } from "@angular/core";
import { CalendarEvent } from "../../..";
import { formatDateRangeString } from "../../../shared/utils";

@Component({
    selector: "app-calendar-item",
    imports: [],
    templateUrl: "./calendar-item.component.html",
    styleUrl: "./calendar-item.component.scss",
})
export class CalendarItemComponent {
    event = input.required<CalendarEvent>();

    formatDateString(startDate: string, endDate: string): string {
        return formatDateRangeString(new Date(startDate), new Date(endDate));
    }
}
