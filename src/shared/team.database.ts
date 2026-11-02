import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult, TeamMember } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>createTeam</Function>
 *
 * Creates a new team record in the database with motto, description text, and initial member image placeholder.
 * Initializes empty array `members` as JSON string (empty brackets "[]") since no users are assigned at creation time yet.
 * Useful for admin setup when defining new work teams, project groups, or committee structures without members initially.
 * Team must be created before adding members via updateMembers function in subsequent workflow stages.
 *
 * @param {string} motto - A short slogan, catchphrase, or guiding principle representing the team's identity and purpose.
 * @param {string} description - Detailed text explaining who the team is, what they work on, their role within organization.
 * @param {string} imageUrl - URL to a representative image for the team displayed in navigation, cards, or list views.
 * @returns {Promise<DatabaseResult>} An object containing database query insertion result object and null on success. Returns error message if database write fails or connection unavailable. Logs errors to console. Throws no explicit errors.
 */
export async function createTeam(motto: string, description: string, imageUrl: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`team\` (\`motto\`, \`text\`, \`picture\`, \`members\`) VALUES (?, ?, ?, ?);`, [motto, description, imageUrl, JSON.stringify([])]);

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

/**
 * <Function>updateTeam</Function>
 *
 * Updates existing team record at specified database ID with new motto, description text, or member image placeholder.
 * Useful for editing team branding, updating descriptions when project scope changes, or replacing outdated images.
 * Only accepts numeric teamId; no other fields can be modified directly - use specialized update functions per field type.
 *
 * @param {number} id - Unique database row identifier of the team record to update in zmt.team table.
 * @param {string} motto - New slogan/catchphrase for this work team replacing old motto text entirely.
 * @param {string} description - Updated detailed text description explaining team composition and purpose after editing.
 * @param {string} imageUrl - URL to new representative image replacing previous placeholder or outdated picture asset links.
 * @returns {Promise<DatabaseResult>} An object containing database query result on successful record update or empty result if not found. Returns error message on database write failure. Logs errors to console. Throws no explicit errors.
 */
export async function updateTeam(id: number, motto: string, description: string, imageUrl: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`team\` SET \`motto\` = ?, \`text\` = ?, \`picture\` = ? WHERE \`id\` = ?;`, [motto, description, imageUrl, id]);

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

/**
 * <Function>getTeam</Function>
 *
 * Retrieves a specific team record by its unique database ID for display, editing, previewing content, or CMS detail rendering.
 * Returns complete team data including motto, description text, image URL, and serialized members array if any assigned yet.
 * Useful when displaying individual team pages, generating team-specific dropdowns, admin interfaces, or filtering navigation based on selected team ID.
 *
 * @param {number} id - Unique database row identifier of the team record to fetch from zmt.team table.
 * @returns {Promise<DatabaseResult>} An object containing `data` (team object or null if not found by ID) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getTeam(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`team\` WHERE \`id\` = ?;`, [id]);

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

/**
 * <Function>getCurrentTeam</Function>
 *
 * Retrieves the most recently created team record from database as singleton current default team for application.
 * Uses ORDER BY id DESC LIMIT 1 to fetch latest insertion and assume it represents currently active project or work group under development.
 * Useful during application initialization, navigation generation, or routing when no explicit team specification given by user session.
 * If multiple teams exist in database, returns newest one regardless of actual activity status or membership assignments.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (most recent team record array) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getCurrentTeam(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`team\` ORDER BY \`id\` DESC LIMIT 1;`);

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

/**
 * <Function>updateMembers</Function>
 *
 * Updates the members field of an existing team record with new array of user IDs serialized to JSON string format.
 * Called when assigning users to a team after creation; typically follows getTeam retrieval, updateTeam branding updates if needed first.
 * Automatically updates timestamp `updated` date to CURRENT_TIMESTAMP each time member list changes or reassignment occurs.
 * Accepts array of database row user ID integers - converts to JSON string for storage in team table members column field.
 *
 * @param {number} teamId - Unique database row identifier of the team record whose membership list will be updated after modification.
 * @param {number[]} members - Array of numeric userId values representing users who should be included in this team's membership roster set. Empty array clears all; non-empty adds exactly these specified user IDs.
 * @returns {Promise<DatabaseResult>} An object containing database query result on successful update with timestamp change or empty if not found. Returns error message on write failure. Logs errors to console. Throws no explicit errors.
 */
export async function updateMembers(teamId: number, members: number[]): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`team\` SET \`members\` = ?, \`updated\` = CURRENT_TIMESTAMP WHERE (\`id\` = ?);`, [JSON.stringify(members), teamId]);

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

/**
 * <Function>getTeamMembers</Function>
 *
 * Retrieves detailed member information for a given list of user IDs including role, profession, motive, secondary picture, plus joined user firstName, lastName, and main picture from users table.
 * Performs SQL JOIN between teamMember and users tables on userId to combine membership metadata with profile data in single result set row per user.
 * Returns array matching length of provided members input array - each object contains role assignment, profession (occupation), motivation/motive statement, optional secondary photo, plus standard first/last name fields.
 * Useful for population team member rosters on webpages, generating member cards, displaying credentials alongside motivational quotes or profile information sections.
 *
 * @param {number[]} members - Array of numeric userId integers representing individuals whose membership details should be fetched and combined into joined result rows. Length determines number of query placeholders substituted dynamically in SQL statement.
 * @returns {Promise<DatabaseResult>} An object containing `data` (joined member profile objects) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getTeamMembers(members: number[]): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `SELECT \`teamMember\`.\`role\`, \`teamMember\`.\`profession\`, \`teamMember\`.\`motive\`, \`teamMember\`.\`secondaryPicture\`, \`users\`.\`firstName\`, \`users\`.\`lastName\`, \`users\`.\`picture\` FROM \`zmt\`.\`teamMember\` JOIN \`zmt\`.\`users\` ON \`teamMember\`.\`userId\` = \`users\`.\`id\` WHERE \`teamMember\`.\`userId\` IN (${members.map(() => "?").join(",")})`,
            members,
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

/**
 * <Function>getTeamMemberEntry</Function>
 *
 * Retrieves a specific teamMember row directly by its user ID identifier from database.
 * Fetches only membership-related fields (role, profession, motive, secondaryPicture) without joining users table profile data yet.
 * Useful when building membership lookup tables, checking member attributes before rendering detailed profiles, or performing validation on existing records.
 *
 * @param {number} userId - Numeric user identifier whose team membership record is being queried from database rows.
 * @returns {Promise<DatabaseResult>} An object containing `data` (team member row object matching userId query) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getTeamMemberEntry(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`teamMember\` WHERE \`userId\` = ?`, [userId]);

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

/**
 * <Function>getAllMembersOfAllTeams</Function>
 *
 * Retrieves all team member entries joined with user profiles from database returning every assigned membership record across entire organization.
 * Performs LEFT JOIN (or INNER depending on query design) between teamMember and users tables producing complete list of users currently assigned to some team as a row each.
 * Useful for generating global team directory, analytics dashboards showing participation statistics, or bulk operations affecting multiple members simultaneously without needing individual lookups.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (all joined member profile records) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getAllMembersOfAllTeams(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`teamMember\` JOIN \`zmt\`.\`users\` ON \`teamMember\`.\`userId\` = \`users\`.\`id\``);

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

/**
 * <Function>getAllTeams</Function>
 *
 * Retrieves all team records from database for comprehensive listings, navigation generation, or bulk operations affecting multiple teams.
 * Fetches every row in zmt.team table including motto text, description body, image URL, members JSON array, and metadata fields like id, created timestamp.
 * Useful when displaying complete team roster, dropdown population for selecting teams, sitemap generation, or analytics showing number of active projects/work groups within organization.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all team objects) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getAllTeams(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`team\`;`);

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

/**
 * <Function>getTeamMemberWithUserData</Function>
 *
 * Retrieves a specific team member entry including user profile data (firstName, lastName, picture) by joining teamMember and users tables.
 * Useful when displaying detailed membership profiles needing both membership metadata (role, profession, motive, secondaryPicture) plus personal profile content from users table simultaneously on same display view page.
 * Performs SQL JOIN query filtering to single row where userId matches provided identifier exactly.
 *
 * @param {number} userId - Numeric user identifier whose combined team and profile record is being fetched for detailed membership profile display purposes.
 * @returns {Promise<DatabaseResult>} An object containing `data` (joined team member row with complete user profile fields) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getTeamMemberWithUserData(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`teamMember\` JOIN \`zmt\`.\`users\` ON \`teamMember\`.\`userId\` = \`users\`.\`id\` WHERE \`teamMember\`.\`userId\` = ?`, [userId]);

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

/**
 * <Function>createTeamMemberEntry</Function>
 *
 * Creates a new team member record in the database inserting userId with default placeholder values 'Noch kein Beruf angegeben' (German for 'Profession not yet specified') and 'Noch keine Motivation angegeben' (no motivation statement yet).
 * Called when adding user to organization; profession and motive fields initialized to empty defaults since they require manual completion by user or admin reviewer workflow.
 * Useful during member onboarding, bulk registration batches, or any process requiring insertion of new membership row before collecting detailed biographical information.
 *
 * @param {number} userId - Numeric identifier of user being added as team member to this organization's membership roster system database.
 * @returns {Promise<DatabaseResult>} An object containing database query insertion result and null on successful creation or empty if insert failed. Returns error message if write operation fails or connection unavailable. Logs errors to console. Throws no explicit errors.
 */
export async function createTeamMemberEntry(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`teamMember\` (\`userId\`, \`profession\`, \`motive\`) VALUES (?, 'Noch kein Beruf angegeben', 'Noch keine Motivation angegeben');`, [
            userId,
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

/**
 * <Function>updateTeamMemberProfession</Function>
 *
 * Updates the profession (occupation) field of a team member record in database.
 * Called when collecting biographical information from new members or editing their profiles during onboarding process workflow.
 * Replaces existing placeholder value 'Noch kein Beruf angegeben' with actual profession title string as provided by user in registration form.
 *
 * @param {number} userId - Unique member identifier whose profession field will be updated after replacement of old value entirely.
 * @param {string} profession - New occupation/work title text describing current job role replacing previous placeholder or outdated profession entry completely.
 * @returns {Promise<DatabaseResult>} An object containing database query update result and null on successful write to profession column. Returns error message if operation fails. Logs errors to console. Throws no explicit errors.
 */
export async function updateTeamMemberProfession(userId: number, profession: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`teamMember\` SET \`profession\` = ? WHERE \`userId\` = ?`, [profession, userId]);

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

/**
 * <Function>updateTeamMemberMotive</Function>
 *
 * Updates the motive (motivation/purpose) field of a team member record in database.
 * Called to collect why a person joined this organization's teams during their onboarding or profile editing workflow process after creation.
 * Replaces initial placeholder text 'Noch keine Motivation angegeben' with actual motivation statement written by user describing their reasons for joining.
 *
 * @param {number} userId - Unique member identifier whose motive field will be updated with new reason for joining replacing placeholder value entirely.
 * @param {string} motive - New motivation/purpose statement string describing why person joined this team organization completely replacing previous default placeholder text.
 * @returns {Promise<DatabaseResult>} An object containing database query update result and null on successful write to motive column. Returns error message if operation fails or connection unavailable. Logs errors to console. Throws no explicit errors.
 */
export async function updateTeamMemberMotive(userId: number, motive: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`teamMember\` SET \`motive\` = ? WHERE \`userId\` = ?`, [motive, userId]);

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

/**
 * <Function>updateTeamMemberRole</Function>
 *
 * Updates the role field of a team member record in database.
 * Used when assigning or changing user's position within their assigned team after creation process completes or during administrative reassignment workflow.
 * Replaces any placeholder default role with actual assigned title or designation string representing official capacity held by this person in organization structure.
 *
 * @param {number} userId - Unique member identifier whose role field will be updated with new designation replacing current value entirely.
 * @param {string} role - New position/title/role name text describing what job function or team responsibility this person holds replacing any previous placeholder or outdated assignment completely.
 * @returns {Promise<DatabaseResult>} An object containing database query update result and null on successful write to role column. Returns error message if operation fails. Logs errors to console. Throws no explicit errors.
 */
export async function updateTeamMemberRole(userId: number, role: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`teamMember\` SET \`role\` = ? WHERE \`userId\` = ?`, [role, userId]);

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

/**
 * <Function>updateTeamMemberSecondaryPicture</Function>
 *
 * Updates the secondary picture field of a team member record in database.
 * Called when adding alternate photo, headshot, or profile image for this team member beyond primary avatar during user upload workflow.
 * Can override placeholder or previous secondary image URL with new external link to uploaded file from media storage system or CDN asset service.
 *
 * @param {number} userId - Unique member identifier whose secondary picture field will be updated to replace any previous photo reference entirely.
 * @param {string|null} secondaryPicture - New alternate profile image URL string replacing placeholder value or set to null explicitly to clear existing secondary photo from database storage field after deletion occurs upstream in file system deletes old asset first before database cleanup operation completes successfully if needed by caller code calling this API function directly.
 * @returns {Promise<DatabaseResult>} An object containing database query update result and null on successful write to secondary picture column. Returns error message if operation fails during connection or write failure handling downstream in calling application components catching thrown exceptions from middleware wrapper functions surrounding SQL queries executing on server machine where runtime environment variables configured appropriately before module load initialization complete successfully at startup time when server process started without errors earlier in deployment pipeline configuration steps completing all setup tasks required for production readiness status check to pass automated testing suites verifying correct behavior under various test scenarios designed specifically targeting edge cases involving null value assignments.
 */
export async function updateTeamMemberSecondaryPicture(userId: number, secondaryPicture: string | null): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`teamMember\` SET \`secondaryPicture\` = ? WHERE \`userId\` = ?`, [secondaryPicture, userId]);

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
