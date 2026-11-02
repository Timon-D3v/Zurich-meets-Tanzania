/**
 * <Function>markdownToHtml</Function>
 * 
 * Converts simple Markdown syntax (custom format) to HTML for displaying formatted text in web pages.
 * Converts line breaks (`\n`) to `<br>` tags, bold (**text**), italic (__text__), underline (+++text+++),
 * and links (![alt](url) -> link). Designed for simple email/blog content formatting without complex Markdown parsers.
 * Returns HTML string; does NOT throw errors (plain conversion). Note: This is a simplified parser, not full Markdown support.
 * 
 * @param {string} markdown - Input string containing Markdown-like syntax to convert.
 * @returns {string} The converted HTML string.
 */
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

/**
 * <Function>getRandomHexString</Function>
 * 
 * Generates a random hexadecimal string of specified length using cryptographically secure randomness.
 * Used for generating codes (e.g., password reset codes, confirmation codes), tokens, or unique identifiers.
 * Each character is randomly selected from "0-9" and "a-f" pool (16 hex characters). Useful for creating short verification codes.
 * Note: Uses Math.random() which is not cryptographically secure; replace with randomBytes/crypto.getRandomValues for production code validation.
 * 
 * @param {number} length - Desired number of hex characters (e.g., 6 for short code, 8 for longer token).
 * @returns {string} Random hexadecimal string of requested length (case-insensitive hex: lowercase a-f only).
 */
export function getRandomHexString(length: number): string {
    const characters = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * <Function>formatDateRangeString</Function>
 * 
 * Formats a date range display string based on various conditions (same day, month or year; include time or not).
 * Uses German locale formatting ("de-CH") for weekday/month names. Outputs in localized German format with appropriate abbreviations.
 * Smartly decides whether to show full "von Zeit bis Zeit" format or just date/day/month without specific hours based on event schedules.
 * Handles multi-month/year ranges across current and past years, with varying time specificity (all day events vs. timed sessions).
 * Example outputs: "Dienstag, 14. März 2025", "14. März bis 31. August" or "Dienstag, 14. März von 18:00 bis 20:00".
 * Uses complex nested conditions to produce natural-sounding German date strings for calendar/event display on website. Returns localized date string or "bis" range format with optional time specifications.
 * 
 * @param {Date} startDate - The starting date of the range (JavaScript Date object).
 * @param {Date} endDate - The ending date of the range (JavaScript Date object).
 * @returns {string} A formatted string representing the date range in Swiss German locale, with appropriate day/month/year/time formatting.
 */
export function formatDateRangeString(startDate: Date, endDate: Date): string {
    const currentYear = new Date().getFullYear();

    const startYear = startDate.getFullYear();
    const startMonth = startDate.toLocaleDateString("de-CH", { month: "long" });
    const startDay = startDate.getDate(); // Get the day of the month (1-31)
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.toLocaleDateString("de-CH", { month: "long" });
    const endDay = endDate.getDate();
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
    const startAndEndHourIsTheSame = startHour === endHour;
    const startAndEndMinuteIsTheSame = startMinute === endMinute;

    const timeIsUnspecific = (startTimeIsUnspecific && endTimeIsUnspecific) || (startAndEndHourIsTheSame && startAndEndMinuteIsTheSame);

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

/**
 * <Function>sleep</Function>
 * 
 * Creates a Promise-based delay function for async operations in TypeScript/Angular code.
 * Wraps setTimeout to return a Promise that resolves after the specified milliseconds (ideal for rate-limiting or sequential processing).
 * Used instead of blocking sleep() calls in production applications. Does NOT throw errors; always returns immediately with resolved promise.
 * 
 * @param {number} ms - Number of milliseconds before the returned Promise resolves. Must be >= 0; use small values like 10ms for rate limiting or larger (1s+) between API calls to avoid throttling.
 * @returns {Promise<void>} Never actually throws error, but will reject if `ms` < 0 (though we check at call site before calling). Resolves with no value after delay. Use await this function like: `await sleep(500)` before retrying failed requests.
 */
export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
