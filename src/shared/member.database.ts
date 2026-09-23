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

export async function getLegacyMemberWithUserId(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`legacyMembers\` WHERE \`userId\` = ?;`, [userId]);

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

export async function createLegacyMember(userId: number, currentPeriodStart: number, currentPeriodEnd: number, startDate: number, status: "unverified" | "verified" | "rejected" = "unverified"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`legacyMembers\` (\`userId\`, \`status\`, \`periodStartTime\`, \`periodEndTime\`, \`subscriptionStartTime\`) VALUES (?, ?, ?, ?, ?);`, [
            userId,
            status,
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

export async function getAllLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`legacyMembers\` JOIN \`zmt\`.\`users\` ON \`legacyMembers\`.\`userId\` = \`users\`.\`id\`;`);

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

export async function getAllUnverifiedLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`legacyMembers\` JOIN \`zmt\`.\`users\` ON \`legacyMembers\`.\`userId\` = \`users\`.\`id\` WHERE \`status\` = 'unverified';`);

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

export async function acceptLegacyMember(userId: number, memberId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`legacyMembers\` SET \`status\` = 'verified' WHERE \`userId\` = ? AND \`legacyMemberId\` = ?;`, [userId, memberId]);

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

export async function rejectLegacyMember(userId: number, memberId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`legacyMembers\` SET \`status\` = 'rejected' WHERE \`userId\` = ? AND \`legacyMemberId\` = ?;`, [userId, memberId]);

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

export async function setUserTypeToMemberForAllVerifiedLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `UPDATE \`zmt\`.\`users\` JOIN \`zmt\`.\`legacyMembers\` ON \`users\`.\`id\` = \`legacyMembers\`.\`userId\` SET \`users\`.\`type\` = 'member' WHERE \`legacyMembers\`.\`status\` = 'verified' AND \`users\`.\`type\` != 'admin';`,
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

export async function resetUserTypeForAllUnverifiedOrRejectedLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `UPDATE \`zmt\`.\`users\` JOIN \`zmt\`.\`legacyMembers\` ON \`users\`.\`id\` = \`legacyMembers\`.\`userId\` SET \`users\`.\`type\` = 'user' WHERE (\`legacyMembers\`.\`status\` = 'unverified' OR \`legacyMembers\`.\`status\` = 'rejected') AND \`users\`.\`type\` != 'admin';`,
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

export async function resetLegacyMemberStatusForExpiredLegacyMember(userId: number, legacyMemberId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`legacyMembers\` SET \`status\` = 'unverified' WHERE \`userId\` = ? AND \`legacyMemberId\` = ?;`, [userId, legacyMemberId]);

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
