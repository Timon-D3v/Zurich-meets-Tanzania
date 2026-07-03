import { raw, Router, Request, Response } from "express";
import { stripeClient } from "../shared/stripe";
import { CONFIG } from "../config";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse } from "..";
import { paymentIntentSucceeded, paymentIntentFailed } from "../shared/events.stripe";
import { storeStripeEvent } from "../shared/payments.database";

// Router Serves under /webhooks
const router = Router();

router.post("/stripe", raw({ type: "application/json" }), async (req: Request, res: Response) => {
    try {
        const signature = req.headers["stripe-signature"] as string;

        const event = stripeClient.webhooks.constructEvent(req.body, signature, CONFIG.ENV === "prod" ? CONFIG.STRIPE_ENDPOINT_SECRET : CONFIG.STRIPE_ENDPOINT_SECRET_TEST);

        switch (event.type) {
            case "payment_intent.succeeded":
                await paymentIntentSucceeded(event);
                break;
            case "payment_intent.payment_failed":
                await paymentIntentFailed(event);
                break;

            default:
                console.log(`Storing unhandled Stripe event with type ${event.type}.`);
                break;
        }

        await storeStripeEvent(event);

        res.status(200).json({ received: true });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.status(400).json({
                error: true,
                message: error.message,
            } as ApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponse);
    }
});

export default router;
