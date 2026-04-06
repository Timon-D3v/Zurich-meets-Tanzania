export function markdownToHtml(markdown: string): string {
    // Simple markdown to HTML conversion
    let html = markdown;

    // Convert line breaks to <br> tags
    html = html.replace(/\n/gm, "<br>");

    // Convert ***bold*** to <strong>bold</strong>
    html = html.replace(/\*\*\*(.*?)\*\*\*/gm, "<strong>$1</strong>");

    // Convert ___italic___ to <em>italic</em>
    html = html.replace(/\_\_\_(.*?)\_\_\_/gm, "<em>$1</em>");

    // Convert +++underline+++ to <u>underline</u>
    html = html.replace(/\+\+\+(.*?)\+\+\+/gm, "<u>$1</u>");

    // Convert ![text](url) to <a href="url">text</a>
    html = html.replace(/\!\[(.*?)\]\((.*?)\)/gm, "<a href='$2' target='_blank'>$1</a>");

    return html;
}

export function formatDateRangeString(startDate: Date, endDate: Date): string {
    const currentYear = new Date().getFullYear();

    const startYear = startDate.getFullYear();
    const startMonth = startDate.toLocaleDateString("de-CH", { month: "long" });
    const startDay = startDate.getDay();
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.toLocaleDateString("de-CH", { month: "long" });
    const endDay = endDate.getDay();
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    const startYearIsCurrentYear = startYear === currentYear;
    const endYearIsCurrentYear = endYear === currentYear;

    const startYearIsSameAsEndYear = startYear === endYear;
    const startMonthIsSameAsEndMonth = startMonth === endMonth;
    const startDayIsSameAsEndDay = startDay === endDay;
    const startHourIsSameAsEndHour = startHour === endHour;
    const startMinuteIsSameAsEndMinute = startMinute === endMinute;

    const startTimeIsUnspecific = startHour === 0 && startMinute === 0;
    const endTimeIsUnspecific = endHour === 0 && endMinute === 0;

    const timeIsUnspecific = startTimeIsUnspecific && endTimeIsUnspecific;

    if (timeIsUnspecific) {
        if (startDayIsSameAsEndDay) {
            if (startMonthIsSameAsEndMonth) {
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Everything is is the same and the year is the current year
                        // => Only show day (including weekday) and month
                        return startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });
                    } else {
                        // Everything is is the same but the year is not the current year
                        // => Show day (including weekday), month and year
                        return startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });
                    }
                } else {
                    // Everything is the same but the years are different
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    return `${startDateString} bis ${endDateString}`;
                }
            } else {
                // Everything is the same but the months are different
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Everything but the month is is the same and the year is the current year
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        return `${startDateString} bis ${endDateString}`;
                    } else {
                        // Everything but the month is is the same but the year is not the current year
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month> <year>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        return `${startDateString} bis ${endDateString}`;
                    }
                } else {
                    // Everything is the same but the years and months are different
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    return `${startDateString} bis ${endDateString}`;
                }
            }
        } else {
            if (startMonthIsSameAsEndMonth) {
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Start day ist not the same, but the rest is
                        // => "<weekday>, <day>. bis <weekday>, <day>. <month>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        return `${startDateString} bis ${endDateString}`;
                    } else {
                        // Start day ist not the same and the year is not the current year
                        // => "<weekday>, <day>. bis <weekday>, <day>. <month> <year>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        return `${startDateString} bis ${endDateString}`;
                    }
                } else {
                    // Start day is not the same and the year is not the current year
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    return `${startDateString} bis ${endDateString}`;
                }
            } else {
                // Start day is not the same and the month is not the same
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Start day and month are not the same, but the year is the current year
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        return `${startDateString} bis ${endDateString}`;
                    } else {
                        // Start day and month are not the same and the year is not the current year
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month> <year>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        return `${startDateString} bis ${endDateString}`;
                    }
                } else {
                    // Start day and month and year are not the same
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    return `${startDateString} bis ${endDateString}`;
                }
            }
        }
    } else {
        if (startDayIsSameAsEndDay) {
            if (startMonthIsSameAsEndMonth) {
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Everything is is the same and the year is the current year but the time is specific
                        // => "<weekday>, <day>. <month> von <time> bis <time>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} von ${startTimeString} bis ${endTimeString}`;
                    } else {
                        // Everything is is the same but the year is not the current year and the time is specific
                        // => "<weekday>, <day>. <month> <year> von <time> bis <time>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} von ${startTimeString} bis ${endTimeString}`;
                    }
                } else {
                    // Everything is the same but the years are different and the time is specific
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year> je von <time> bis <time>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const startTimeString = startDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    const endTimeString = endDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                }
            } else {
                // Everything is the same but the months are different and the time is specific
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Everything but the month is is the same and the year is the current year also the time is specific
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month> je von <time> bis <time>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                    } else {
                        // Everything but the month is is the same but the year is not the current year and the time is specific
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month> <year> je von <time> bis <time>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                    }
                } else {
                    // Everything is the same but the years and months are different and the time is specific
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year> je von <time> bis <time>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const startTimeString = startDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    const endTimeString = endDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                }
            }
        } else {
            if (startMonthIsSameAsEndMonth) {
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Start day ist not the same, but the rest is also the time is specific
                        // => "<weekday>, <day>. bis <weekday>, <day>. <month>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                    } else {
                        // Start day ist not the same and the year is not the current year also the time is specific
                        // => "<weekday>, <day>. bis <weekday>, <day>. <month> <year> je von <time> bis <time>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                    }
                } else {
                    // Start day and month is not the same and the year is not the current year also the time is specific
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year> je von <time> bis <time>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const startTimeString = startDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    const endTimeString = endDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                }
            } else {
                // Start day and month is not the same and the year is not the current year also the time is specific
                // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year> je von <time> bis <time>"
                if (startYearIsSameAsEndYear) {
                    if (startYearIsCurrentYear) {
                        // Start day and month are not the same, but the year is the current year
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                    } else {
                        // Start day and month are not the same and the year is not the current year
                        // => "<weekday>, <day>. <month> bis <weekday>, <day>. <month> <year>"
                        const startDateString = startDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                        });

                        const endDateString = endDate.toLocaleDateString("de-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        const startTimeString = startDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        const endTimeString = endDate.toLocaleTimeString("de-CH", {
                            hour: "numeric",
                            minute: "2-digit",
                        });

                        return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                    }
                } else {
                    // Start day and month and year are not the same
                    // => "<weekday>, <day>. <month> <year> bis <weekday>, <day>. <month> <year>"
                    const startDateString = startDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const endDateString = endDate.toLocaleDateString("de-CH", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const startTimeString = startDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    const endTimeString = endDate.toLocaleTimeString("de-CH", {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    return `${startDateString} bis ${endDateString} je von ${startTimeString} bis ${endTimeString}`;
                }
            }
        }
    }
}
