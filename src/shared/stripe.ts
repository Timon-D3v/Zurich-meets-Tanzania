import Stripe from "stripe";
import { CONFIG } from "../config";

export const stripeClient = new Stripe(CONFIG.ENV === "prod" ? CONFIG.STRIPE_PRIVATE_KEY : CONFIG.STRIPE_PRIVATE_KEY_TEST);

export default stripeClient;
