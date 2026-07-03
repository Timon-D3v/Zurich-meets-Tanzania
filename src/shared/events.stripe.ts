import { stripeClient } from "./stripe";
import { setUserTypeToMember, getMemberWithUserId, createMember, updateMember } from "./member.database";

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

    const subscriptionList = await stripeClient.subscriptions.list({
        customer: customerId,
    });

    const subscription = customer.subscriptions?.data[0];

    if (!subscription) {
        throw new Error("No subscription found for customer " + customerId);
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

export async function paymentIntentFailed(event: any): Promise<void> {
    const paymentIntent = event.data.object;

    console.log("PaymentIntent failed!");
    console.log("PaymentIntent:", paymentIntent);
}
