import { initOpenapiSDK, openApiClient } from "tianji-client-sdk";
import { CONFIG } from "../config";
import { VisitorCounts } from "..";

initOpenapiSDK(CONFIG.TIANJI_URL, {
    apiKey: CONFIG.TIANJI_API_KEY,
});

// async function getSystemConfig() {
//   try {
//     const config = await openApiClient.GlobalService.globalConfig();

//     console.log('Allow registration:', config.allowRegister);
//     console.log('Billing enabled:', config.enableBilling);

//     return config;
//   } catch (error) {
//     console.error('Failed to get system configuration:', error);
//   }
// }

export async function getLastXDaysVisitorCounts(days: number): Promise<VisitorCounts[]> {
    try {
        const statsStorage = [];

        for (let i = 0; i < days; i++) {
            // Get page view stats for the date range
            const stats = await openApiClient.WebsiteService.websiteStats({
                //   shareId: "your-share-id-if-using-public-api", // Replace with your share ID if using public API
                workspaceId: CONFIG.TIANJI_WORKSPACE_ID,
                websiteId: CONFIG.TIANJI_WEBSITE_ID,
                startAt: Date.now() - (i + 1) * 24 * 60 * 60 * 1000,
                endAt: Date.now() - i * 24 * 60 * 60 * 1000,
            });

            statsStorage.push(stats);
        }

        // Now the array is reversed
        statsStorage.reverse();

        return statsStorage;
    } catch (error) {
        console.error("Error fetching visitor counts:", error);
        throw new Error("Failed to fetch visitor counts");
    }
}
