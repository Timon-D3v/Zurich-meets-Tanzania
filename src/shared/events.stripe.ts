import { stripeClient } from "./stripe";
import { setUserTypeToMember, getMemberWithUserId, createMember, updateMember } from "./member.database";
import { sendCriticalErrorEmailForStripeSubscriptionNotFound } from "./member.email";

/**
 * <Function>paymentIntentSucceeded</Function>
 * 
 * Handles Stripe webhook event when a payment intention is successfully completed.
 * Processes customer subscription lookup, updates user type to member, and syncs member subscription data (start/end dates, status).
 * If a new customer/subscription not found for userId, automatically creates member record with subscription info.
 * Sends critical error notification if subscription cannot be found after multiple retries (FATAL ERROR).
 * Part of the donation checkout flow on Stripe checkout session completion.
 * 
 * @param {any} event - The Stripe webhook event object containing: id, type ("payment_intent.succeeded"), and eventData with paymentIntent details.
 *     Can be any JSON-serializable object since stripe package uses `any` type for webhook events.
 * @returns {Promise<void>} Resolves successfully when payment processing is complete and member/subscriptions are synced up. Never returns a value (void). Logs success message to console on completion; throws Error if critical issues occur like deleted customer or missing subscription after retries. Sends failure notification email if needed before throwing.
 */
export async function paymentIntentSucceeded(event: any): Promise<void> {
    const paymentIntent = event.data.object;

    const customerId = paymentIntent.customer;

    const customer = await stripeClient.customers.retrieve(customerId, {
        expand: ["subscriptions"],
    });

    if (customer.deleted) {
        throw new Error("Customer was deleted");
    }

    const userId = Number(customer.metadata["userId"]);

    if (userId < 1 || isNaN(userId)) {
        throw new Error("Invalid userId in customer metadata");
    }

    let retriesPossible = 5;
    let subscription = customer.subscriptions?.data[0];

    while (retriesPossible > 0 && !subscription) {
        console.warn("No subscription found for customer " + customerId + ". Retrying...");

        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying

        const subscriptionList = await stripeClient.subscriptions.list({
            customer: customerId,
        });

        subscription = subscriptionList?.data[0];

        if (subscription) {
            break; // Exit the loop if a subscription is found
        }

        retriesPossible--;
    }

    if (!subscription) {
        // FATAL ERROR: REPORT TO ADMINS

        await sendCriticalErrorEmailForStripeSubscriptionNotFound(customerId, userId);

        throw new Error("\n\n\n\nFATAl ERROR:\n\nNo subscription found for customer " + customerId + " after multiple retries. \nThis is a critical issue that needs immediate attention.\n\n\n\n");
    }

    const setUserTypeToMemberResult = await setUserTypeToMember(userId);

    if (setUserTypeToMemberResult.error) {
        throw new Error(setUserTypeToMemberResult.error);
    }

    const result = await getMemberWithUserId(userId);

    if (result.error || !result.data) {
        throw new Error(result.error);
    }

    if (result.data.length === 0) {
        const createMemberResult = await createMember(
            userId,
            subscription.id,
            customerId,
            subscription.status,
            subscription.items.data[0].current_period_start * 1000,
            subscription.items.data[0].current_period_end * 1000,
            subscription.start_date * 1000,
        );

        if (createMemberResult.error) {
            throw new Error(createMemberResult.error);
        }
    } else {
        const updateMemberResult = await updateMember(
            result.data[0].memberId,
            userId,
            subscription.id,
            customerId,
            subscription.status,
            subscription.items.data[0].current_period_start * 1000,
            subscription.items.data[0].current_period_end * 1000,
            subscription.start_date * 1000,
        );

        if (updateMemberResult.error) {
            throw new Error(updateMemberResult.error);
        }
    }

    console.log("PaymentIntent was successful!");
}

/**
 * <Function>paymentIntentFailed</Function>
 * 
 * Handles Stripe webhook event when a payment intention fails or is cancelled.
 * Logs the failed payment attempt details for debugging and monitoring purposes.
 * Does NOT throw errors; simply logs information to console for admin review.
 * Part of the error handling flow if card charge fails or customer cancels checkout session.
 * 
 * @param {any} event - The Stripe webhook event object containing: id, type ("payment_intent.payment_failed" or similar), and eventData with failed payment details.
 *     Can be any JSON-serializable object since stripe package uses `any` type for webhook events.
 * @returns {Promise<void>} Resolves successfully after logging failure info. Never returns a value (void); always throws no errors unless event processing itself fails internally.
 */
export async function paymentIntentFailed(event: any): Promise<void> {
    const paymentIntent = event.data.object;

    console.log("PaymentIntent failed!");
    console.log("PaymentIntent:", paymentIntent);
}
