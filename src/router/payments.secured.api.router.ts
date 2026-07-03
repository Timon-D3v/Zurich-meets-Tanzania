import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { CONFIG } from "../config";
import { CreateCheckoutSessionApiEndpointResponse, StripeCheckoutSession } from "..";
import { stripeClient } from "../shared/stripe";
import { storeStripeCustomer, storeStripeCheckoutSession } from "../shared/payments.database";

// Router Serves under /api/secured/payments
const router = Router();

router.get("/createCheckoutSession", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.session.user!;

        const customer = await stripeClient.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            description: JSON.stringify({
                phone: user.phone,
                address: user.address,
            }),
            address: {
                line1: user.address?.split(',')?.[0],
                city: user.address?.split(', ')[1]?.split(' ')?.slice(1)?.join(' '),
                postal_code: user.address?.split(', ')[1]?.split(' ')?.[0],
            },
            metadata: {
                userId: user.id,
            }
        })


        const storeCustomerResult = await storeStripeCustomer(user.id, customer.id);

        if (storeCustomerResult.error) {
            throw new Error(storeCustomerResult.error);
        }

        const session = await stripeClient.checkout.sessions.create({
            client_reference_id: user.id.toString(),
            customer: customer.id,
            line_items: [
                {
                    price: CONFIG.ENV === "prod" ? CONFIG.STRIPE_PRICE_MEMBERSHIP : CONFIG.STRIPE_PRICE_MEMBERSHIP_TEST,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user.id,
                customerId: customer.id,
            },
            mode: "subscription",
            origin_context: "web",
            // Cannot be used with subscription mode, setup_future_usage is set by default for subscriptions
            // payment_intent_data: {
            //     setup_future_usage: "off_session",
            // },
            submit_type: "subscribe",
            subscription_data: {
                // If the board wants to have a fixed billing cycle use this:
                billing_cycle_anchor_config: {
                    day_of_month: 1,
                    month: 1,
                    hour: 12,
                    minute: 0,
                    second: 0,
                },
                description: "Der ZMT Mitgliederbeitrag wird verwendet um alle Administrationskosten, die Vereinsaktivitäten (z.B. unsere Generalversammlung) und die Webseite zu finanzieren. Vielen Dank für deine Unterstützung!",
                metadata: {
                    userId: user.id,
                    customerId: customer.id,

                },
                // If set to 'create_prorations' => Percentage of the year, the user is a member (Until the 1st of January), we will charge them for that percentage.
                // Set the 'none' to disable this behavior. The user will be charged the full amount, regardless of when they become a member.
                proration_behavior: "create_prorations", 
            },
            success_url: `${CONFIG.ORIGIN}/payment-success`,
            cancel_url: `${CONFIG.ORIGIN}/payment-cancelled`,
            ui_mode: "hosted_page",
        })

        // const session: any = await stripeClient.checkout.sessions.create({
        //     line_items: [
        //         {
        //             price: CONFIG.ENV === "prod" ? CONFIG.STRIPE_PRICE_MEMBERSHIP : CONFIG.STRIPE_PRICE_MEMBERSHIP_TEST,
        //             quantity: 1,
        //         },
        //     ],
        //     mode: "subscription",
        //     success_url: `${CONFIG.ORIGIN}/payment-success`, // CHANGE AND CREATE ROUTES
        //     cancel_url: `${CONFIG.ORIGIN}/payment-cancelled`,
        // });


        const result = await storeStripeCheckoutSession(user.id, session.id, customer.id);

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: { url: session.url },
        } as CreateCheckoutSessionApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as CreateCheckoutSessionApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as CreateCheckoutSessionApiEndpointResponse);
    }
});

export default router;
