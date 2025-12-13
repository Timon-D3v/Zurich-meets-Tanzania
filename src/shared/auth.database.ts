import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

export async function getUserWithEmail(email: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`users\` WHERE (\`email\` = ?);`, email);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

export async function setNewPassword(email: string, hashedPassword: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`password\` = ? WHERE (\`email\` = ?);`, [hashedPassword, email]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

export async function createUser(email: string, hashedPassword: string, name: string, family_name: string, address: string, phone: string, pictureUrl: string, type: "user" | "member" | "admin" = "user"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `INSERT INTO \`zmt\`.\`users\` (\`username\`, \`password\`, \`name\`, \`family_name\`, \`email\`, \`picture\`, \`phone\`, \`type\`, \`address\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [email, hashedPassword, name, family_name, email, pictureUrl, phone, type, address],
        );

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}
