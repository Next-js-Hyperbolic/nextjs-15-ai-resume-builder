"use server"

import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server"

export async function createCustomerPortalSession() {
    // Get the Stripe User
    const user = await currentUser();
    if (!user) {
        throw new Error("Unauthorized.");
    }

    // Get the Stripe CustomerId from the user's private metadata
    const stripeCustomerId = user.privateMetadata.stripeCustomerId as | string | undefined;
    if (!stripeCustomerId) {
        throw new Error("No Stripe CustomerId found.");
    }

    // Create a Stripe billing portal session with the customerId
    const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
    })
    if (!session.url) {
        throw new Error("No Stripe billing session URL found.");
    }

    // Return the portal billing portal session
    return session.url;
}