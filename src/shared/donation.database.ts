import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { PUBLIC_CONFIG } from "../publicConfig";
import { DatabaseResult } from "..";

export async function getAllDonationUsageTypes(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`title\` FROM \`zmt\`.\`donationUsageTypes\`;`);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

export async function insertDonationRequest(amount: number, firstName: string, lastName: string, email: string, usageType: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`donationRequests\` (\`amount\`, \`firstName\`, \`lastName\`, \`email\`, \`usageType\`) VALUES (?, ?, ?, ?, ?);`, [
            amount,
            firstName,
            lastName,
            email,
            usageType,
        ]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}
