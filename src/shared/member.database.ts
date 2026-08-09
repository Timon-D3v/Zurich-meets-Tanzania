import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

export async function getMemberWithUserId(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`members\` WHERE \`userId\` = ?;`, [userId]);

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

export async function setUserTypeToMember(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`type\` = 'member' WHERE \`id\` = ? AND \`type\` != 'admin';`, [userId]);

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

export async function createMember(userId: number, subscriptionId: string, customerId: string, status: string, currentPeriodStart: number, currentPeriodEnd: number, startDate: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `INSERT INTO \`zmt\`.\`members\` (\`userId\`, \`subscriptionId\`, \`customerId\`, \`status\`, \`periodStartTime\`, \`periodEndTime\`, \`subscriptionStartTime\`) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [userId, subscriptionId, customerId, status, currentPeriodStart, currentPeriodEnd, startDate],
        );

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

export async function updateMember(memberId: number, userId: number, subscriptionId: string, customerId: string, status: string, currentPeriodStart: number, currentPeriodEnd: number, startDate: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `UPDATE \`zmt\`.\`members\` SET \`userId\` = ?, \`subscriptionId\` = ?, \`customerId\` = ?, \`status\` = ?, \`periodStartTime\` = ?, \`periodEndTime\` = ?, \`subscriptionStartTime\` = ? WHERE \`memberId\` = ?`,
            [userId, subscriptionId, customerId, status, currentPeriodStart, currentPeriodEnd, startDate, memberId],
        );

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

export async function createLegacyMember(userId: number, currentPeriodStart: number, currentPeriodEnd: number, startDate: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`legacyMembers\` (\`userId\`, \`status\`, \`periodStartTime\`, \`periodEndTime\`, \`subscriptionStartTime\`) VALUES (?, ?, ?, ?, ?);`, [
            userId,
            "unverified",
            currentPeriodStart,
            currentPeriodEnd,
            startDate,
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
