import Stripe from "stripe";
import { CONFIG } from "../config";

/**
 * <Variable>stripeClient</Variable>
 * 
 * Singleton Stripe API client interface configured with environment-specific credentials.
 * Instantiated during module initialization using private key from either live (production) or test mode based on current configuration.
 * Reused across all Stripe-related operations including payment intent creation, customer management, subscription handling, webhook verification, and charge lookups.
 * Uses CONFIG.STRIPE_PRIVATE_KEY for production environments and CONFIG.STRIPE_PRIVATE_KEY_TEST for development/testing when ENV is set to non-prod values.
 * Never exposes secrets or credentials in function parameters; relies on module-level initialization with secure secret management system.
 */
export const stripeClient = new Stripe(CONFIG.ENV === "prod" ? CONFIG.STRIPE_PRIVATE_KEY : CONFIG.STRIPE_PRIVATE_KEY_TEST);

/**
 * <ExportDefault>stripeClient</ExportDefault>
 * 
 * Default export providing direct import convenience across module boundaries.
 * Allows importing with `import stripe from "./stripe"` without naming the imported variable.
 * Points to same instance as named export `stripeClient`; both references refer to identical Singleton Stripe API client object in memory.
 */
export default stripeClient;
