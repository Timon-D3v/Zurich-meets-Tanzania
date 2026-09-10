import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { CalendarService } from "../../../services/calendar.service";

@Component({
    selector: "app-calendar-create-event",
    imports: [ReactiveFormsModule],
    templateUrl: "./calendar-create-event.component.html",
    styleUrl: "./calendar-create-event.component.scss",
})
export class CalendarCreateEventComponent {
    submitButtonText = signal("Hinzufügen");
    submitButtonDisabled = signal(false);

    addCalendarEventForm = new FormGroup({
        eventDescriptionControl: new FormControl(""),
        multipleDaysControl: new FormControl(false),
        startDateControl: new FormControl(""),
        endDateControl: new FormControl(""),
        eventDateControl: new FormControl(""),
        specificTimeControl: new FormControl(false),
        startTimeControl: new FormControl(""),
        endTimeControl: new FormControl(""),
    });

    eventIsMultipleDays = signal<boolean>(false);
    eventTimeIsSpecific = signal<boolean>(false);

    private calendarService = inject(CalendarService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    toggleIfEventIsMultipleDays(): void {
        this.eventIsMultipleDays.update((isMultipleDays) => !isMultipleDays);
    }

    toggleIfEventTimeIsSpecific(): void {
        this.eventTimeIsSpecific.update((isSpecific) => !isSpecific);
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.submitButtonDisabled.set(true);
        this.submitButtonText.set("Verarbeiten...");

        const title = this.addCalendarEventForm.value.eventDescriptionControl;
        const isMultipleDays = this.addCalendarEventForm.value.multipleDaysControl;
        const startDate = this.addCalendarEventForm.value.startDateControl;
        const endDate = this.addCalendarEventForm.value.endDateControl;
        const date = this.addCalendarEventForm.value.eventDateControl;
        const timeIsSpecific = this.addCalendarEventForm.value.specificTimeControl;
        const startTime = this.addCalendarEventForm.value.startTimeControl;
        const endTime = this.addCalendarEventForm.value.endTimeControl;

        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot send post request if not in browser context.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (typeof isMultipleDays !== "boolean") {
            this.notificationService.error("Eingabefehler:", "Bitte gib an, ob es sich um ein mehrtägiges Event handelt oder nicht.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (typeof timeIsSpecific !== "boolean") {
            this.notificationService.error("Eingabefehler:", "Bitte gib an, ob es sich um ein Event mit spezifischer Uhrzeit handelt oder nicht.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (typeof title !== "string" || title.trim() === "") {
            this.notificationService.error("Eingabefehler:", "Bitte gib dem Event eine Beschreibung.");

            this.submitButtonDisabled.set(false);
            this.submitButtonText.set("Hinzufügen");

            return;
        }

        if (isMultipleDays) {
            if (typeof startDate !== "string" || startDate.trim() === "" || isNaN(Date.parse(startDate))) {
                this.notificationService.error("Eingabefehler:", "Bitte gib ein gültiges Startdatum ein.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }

            if (typeof endDate !== "string" || endDate.trim() === "" || isNaN(Date.parse(endDate))) {
                this.notificationService.error("Eingabefehler:", "Bitte gib ein gültiges Enddatum ein.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }

            if (new Date(startDate) >= new Date(endDate)) {
                this.notificationService.error("Eingabefehler:", "Das Startdatum darf nicht nach dem Enddatum liegen.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }
        } else {
            if (typeof date !== "string" || date.trim() === "" || isNaN(Date.parse(date))) {
                this.notificationService.error("Eingabefehler:", "Bitte gib ein gültiges Datum ein.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }
        }

        if (timeIsSpecific) {
            if (typeof startTime !== "string" || startTime.trim() === "" || !/^\d{2}:\d{2}$/.test(startTime)) {
                this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Startzeit im Format HH:MM ein.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }

            if (typeof endTime !== "string" || endTime.trim() === "" || !/^\d{2}:\d{2}$/.test(endTime)) {
                this.notificationService.error("Eingabefehler:", "Bitte gib eine gültige Endzeit im Format HH:MM ein.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }

            if (new Date(`2000-01-01T${startTime}:00`) >= new Date(`2000-01-01T${endTime}:00`)) {
                this.notificationService.error("Eingabefehler:", "Die Startzeit darf nicht nach der Endzeit liegen.");

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");

                return;
            }
        }

        const request = this.calendarService.createEvent(title, isMultipleDays, date ?? "", startDate ?? "", endDate ?? "", timeIsSpecific, startTime ?? "", endTime ?? "");

        request.subscribe({
            next: (response) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", response.message);

                    this.submitButtonDisabled.set(false);
                    this.submitButtonText.set("Hinzufügen");

                    return;
                }

                this.notificationService.success("Erfolg:", "Das Event wurde erfolgreich zum Kalender hinzugefügt.");

                this.addCalendarEventForm.reset();

                this.addCalendarEventForm.patchValue({
                    multipleDaysControl: false,
                    specificTimeControl: false,
                });

                this.eventIsMultipleDays.set(false);
                this.eventTimeIsSpecific.set(false);

                this.submitButtonDisabled.set(false);
                this.submitButtonText.set("Hinzufügen");
            },
            error: (error) => {
                console.error(error);
                this.notificationService.error("Fataler Fehler:", "Beim Erstellen des Events ist ein fataler Fehler aufgetreten: " + error.message);
            },
        });

        console.log("Form Value:", this.addCalendarEventForm.value);

        this.submitButtonDisabled.set(false);
        this.submitButtonText.set("Hinzufügen");
    }
}
