import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiEndpointResponse, GetCalendarEventsApiEndpointResponse } from "../..";

@Injectable({
    providedIn: "root",
})
export class CalendarService {
    private http = inject(HttpClient);

    getLastXEvents(x: number): Observable<GetCalendarEventsApiEndpointResponse> {
        const request = this.http.get<GetCalendarEventsApiEndpointResponse>(`/api/calendar/getLastXEvents/${x}`);

        return request;
    }

    getAllEvents(): Observable<GetCalendarEventsApiEndpointResponse> {
        const request = this.http.get<GetCalendarEventsApiEndpointResponse>(`/api/secured/admin/calendar/getAllEvents`);

        return request;
    }

    createEvent(title: string, isMultipleDays: boolean, date: string, startDate: string, endDate: string, timeIsSpecific: boolean, startTime: string, endTime: string): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>(`/api/secured/admin/calendar/createEvent`, {
            title,
            isMultipleDays,
            date,
            startDate,
            endDate,
            timeIsSpecific,
            startTime,
            endTime,
        });

        return request;
    }

    deleteEvent(id: number): Observable<ApiEndpointResponse> {
        const request = this.http.post<ApiEndpointResponse>(`/api/secured/admin/calendar/deleteEvent`, { id });

        return request;
    }
}
