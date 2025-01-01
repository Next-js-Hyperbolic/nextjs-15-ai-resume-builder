"use server"

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server"

export async function createCheckoutSession(priceId: string) {
    const user = await currentUser();

    if (!user) {
        throw new Error("You must be signed in to create a checkout session");
    }

    const stripeCustomerId = user.privateMetadata?.stripeCustomerId as string | undefined;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
        cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
        customer: stripeCustomerId,
        customer_email: stripeCustomerId ? undefined : user.emailAddresses[0].emailAddress,
        // Attach user data to checkout session
        metadata: {
            userId: user.id,
        },
        subscription_data: {
            metadata: {
                userId: user.id,
            }
        },
        custom_text: {
            terms_of_service_acceptance: {
                message: `By clicking "Subscribe", you agree to our (AI Resume Builder) [Terms of Service](${env.NEXT_PUBLIC_BASE_URL}/tos).`,
            }
        },
        consent_collection: {
            terms_of_service: "required",
        }
    })

    if (!session.url) {
        throw new Error("No checkout session URL returned");
    }

    return session.url
}