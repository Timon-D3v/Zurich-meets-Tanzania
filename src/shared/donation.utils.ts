import { getAllDonationUsageTypes, getAllDonationMeters } from "./donation.database";

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
