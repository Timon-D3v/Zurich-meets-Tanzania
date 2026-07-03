import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

export async function getBoard(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `SELECT \`board\`.\`role\`, \`board\`.\`profession\`, \`board\`.\`motive\`, \`board\`.\`secondaryPicture\`, \`users\`.\`firstName\`, \`users\`.\`lastName\`, \`users\`.\`picture\` FROM \`zmt\`.\`board\` JOIN \`zmt\`.\`users\` ON \`board\`.\`userId\` = \`users\`.\`id\`;`,
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
