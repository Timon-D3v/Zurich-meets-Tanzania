import { getAllDonationUsageTypes, getAllDonationMeters } from "./donation.database";

/**
 * <Function>getAllUsageTypes</Function>
 *
 * Retrieves all unique usage type names for donations from the database and donation meter titles.
 * Useful for populating dropdown selectors in donation forms or displaying available fundraising categories.
 * Includes both `donationUsageTypes` table entries and active `donationMeter` campaign titles.
 * Throws an error if any database query fails or returns errors.
 *
 * @returns {Promise<string[]>} Array of unique usage type strings from all sources. May contain duplicates if same name exists in multiple tables (for dropdown uniqueness, ensure before display). Logs errors to console on failure.
 */
export async function getAllUsageTypes(): Promise<string[]> {
    const usageTypes = [];

    const result = await getAllDonationUsageTypes();

    if (result.error) {
        throw new Error(result.error);
    }

    for (let i = 0; i < result.data!.length; i++) {
        usageTypes.push(result.data![i].title);
    }

    const donationMetersResult = await getAllDonationMeters();

    if (donationMetersResult.error) {
        throw new Error(donationMetersResult.error);
    }

    for (let i = 0; i < donationMetersResult.data!.length; i++) {
        usageTypes.push(donationMetersResult.data![i].title);
    }

    return usageTypes;
}
