import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>storeStripeEvent</Function>
 *
 * Stores a Stripe webhook event payload in the database for later reference, debugging, or audit purposes.
 * Called by Stripe webhooks to record payment events, subscription changes, refund information, etc.
 * Stores full JSON event data including eventId, eventType, and complete eventData object (typed as `any` from stripe package).
 * Useful for compliance reports, dispute resolution, or when investigating failed payments. Returns empty result.
 *
 * @param {any} event - The Stripe WebhookEvent object (or plain object) containing: id, type (eventType), and other metadata.
 *     Can be any JSON-serializable object since stripe package uses `any` type for webhook events.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error on failure. Logs errors to console.
 */
export async function storeStripeEvent(event: any): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`stripeEvents\` (\`eventId\`, \`eventType\`, \`eventData\`) VALUES (?, ?, ?);`, [event.id, event.type, JSON.stringify(event)]);

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

/**
 * <Function>storeStripeCustomer</Function>
 *
 * Records a Stripe Customer ID linked to a local user's database record for identity and payment management.
 * Called when successfully creating Stripe customer from checkout session or card details.
 * Enables future retrieval of customer data (payment methods, subscriptions) using customerId instead of querying users table repeatedly.
 * Uses userId field as foreign key to zmt.users table; customerId stores external Stripe's unique customer identifier.
 *
 * @param {number} userId - Unique identifier in local database for user this Stripe customer belongs to.
 * @param {string} customerId - The unique customer ID from Stripe API used for subsequent lookups and operations.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function storeStripeCustomer(userId: number, customerId: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`stripeCustomers\` (\`userId\`, \`customerId\`) VALUES (?, ?);`, [userId, customerId]);

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

/**
 * <Function>getStripeCustomerByUserId</Function>
 *
 * Retrieves the Stripe Customer ID that's been stored for a local database user.
 * Used to fetch customer data from Stripe API (payment methods, subscriptions) without re-querying checkout sessions.
 * Returns empty result if no Stripe customer has been created for this user yet. Useful after successful card capture.
 *
 * @param {number} userId - Unique identifier of the local database user whose Stripe customer record to find.
 * @returns {Promise<DatabaseResult>} An object containing `data` (array with result row or empty if not found) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getStripeCustomerByUserId(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`stripeCustomers\` WHERE \`userId\` = ?;`, [userId]);

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

/**
 * <Function>storeStripeCheckoutSession</Function>
 *
 * Records a Stripe Checkout Session ID with its associated user for payment session tracking and subscription creation.
 * Called when successfully creating session from user, stores link between local userId and Stripe's sessionId.
 * customerId also stored to enable later customer lookup using Stripe API without re-querying users table.
 * Essential for state management in payment flows (redirects, webhook callbacks).
 *
 * @param {number} userId - Unique identifier of the local database user this checkout belongs to.
 * @param {string} sessionId - The unique session ID from Stripe Checkout API.
 * @param {string} customerId - The associated Stripe customer ID if already created (or empty string).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error on failure. Logs errors to console.
 */
export async function storeStripeCheckoutSession(userId: number, sessionId: string, customerId: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`stripeCheckoutSessions\` (\`userId\`, \`sessionId\`, \`customerId\`) VALUES (?, ?, ?);`, [userId, sessionId, customerId]);

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

/**
 * <Function>getStripeCheckoutSessionByUserId</Function>
 *
 * Retrieves the Stripe checkout session that belongs to a local database user.
 * Called when processing payment completion, checking session validity after webhook callbacks, or displaying pending payments in admin panel.
 * Returns empty result if no checkout session exists for this user. Used before processing completed payments via Stripe API.
 *
 * @param {number} userId - Unique identifier of the local database user whose checkout session to find.
 * @returns {Promise<DatabaseResult>} An object containing `data` (array with session row or empty if not found) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getStripeCheckoutSessionByUserId(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`stripeCheckoutSessions\` WHERE \`userId\` = ?;`, [userId]);

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
