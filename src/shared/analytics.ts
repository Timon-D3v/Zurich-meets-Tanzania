import { initOpenapiSDK, openApiClient } from "tianji-client-sdk";
import { CONFIG } from "../config";
import { VisitorCounts } from "..";

initOpenapiSDK(CONFIG.TIANJI_URL, {
    apiKey: CONFIG.TIANJI_API_KEY,
});

/**
 * <Function>getLastXDaysVisitorCounts</Function>
 *
 * Fetches visitor counts (page views, uniques, bounces, time) for the last N days from Tiangji analytics API.
 * Handles rate limits and failures gracefully by returning zero stats for problematic days.
 * Useful for displaying statistics on homepage or admin dashboard showing weekly/monthly trends.
 *
 * @param {number} days - Number of past days to fetch (e.g., 7 for weekly, 30 for monthly).
 * @returns {Promise<VisitorCounts[]>} Array of visitor count objects with pageviews, uniques, bounces, and totaltime data per day. Throws an error if API request fails completely. Logs errors to console during retries.
 */
export async function getLastXDaysVisitorCounts(days: number): Promise<VisitorCounts[]> {
    try {
        const statsStorage = [];
        const now = new Date();

        for (let i = 0; i < days; i++) {
            try {
                // Calculate the start and end of the day (i days ago)
                const dayStart = new Date(now);
                dayStart.setDate(now.getDate() - i);
                dayStart.setHours(0, 0, 0, 0); // Set to start of day

                const dayEnd = new Date(dayStart);
                dayEnd.setDate(dayStart.getDate() + 1); // Set to end of day (next day at 00:00)
                dayEnd.setTime(dayEnd.getTime() - 1); // Subtract 1ms to include the last second

                // Get page view stats for the date range
                const stats: VisitorCounts = await openApiClient.WebsiteService.websiteStats({
                    workspaceId: CONFIG.TIANJI_WORKSPACE_ID,
                    websiteId: CONFIG.TIANJI_WEBSITE_ID,
                    startAt: dayStart.getTime(),
                    endAt: dayEnd.getTime(),
                });

                statsStorage.push(stats);
            } catch (error) {
                console.error(`Error fetching stats for day ${now.getDate() - i}:`, error, "Skipping this day.");

                statsStorage.push({
                    bounces: { value: 0, prev: 0 },
                    pageviews: { value: 0, prev: 0 },
                    uniques: { value: 0, prev: 0 },
                    totaltime: { value: 0, prev: 0 },
                });
            }
        }

        // Now the array is reversed and the most recent stats are at the end of the array
        statsStorage.reverse();

        return statsStorage;
    } catch (error) {
        console.error("Error fetching visitor counts:", error);
        throw new Error("Failed to fetch visitor counts");
    }
}
