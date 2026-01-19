import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult, StaticSite } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

export async function getStaticSite(
    title:
        | "vision"
        | "board"
        | "beginning"
        | "finances"
        | "income-statement"
        | "general-meeting"
        | "statutes"
        | "zurich-meets-tanzania"
        | "tanzania-meets-zurich"
        | "mbuzi"
        | "gynecology"
        | "meducation"
        | "bajaji"
        | "cardiology"
        | "surgery"
        | "history",
): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`subpages\` WHERE (\`title\` = ?);`, [title]);

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

export async function updateStaticSite(
    title:
        | "vision"
        | "board"
        | "beginning"
        | "finances"
        | "income-statement"
        | "general-meeting"
        | "statutes"
        | "zurich-meets-tanzania"
        | "tanzania-meets-zurich"
        | "mbuzi"
        | "gynecology"
        | "meducation"
        | "bajaji"
        | "cardiology"
        | "surgery"
        | "history",
    site: StaticSite,
): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`subpages\` SET \`data\` = ?, date = CURRENT_TIMESTAMP WHERE (\`title\` = ?);`, [JSON.stringify(site), title]);

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
