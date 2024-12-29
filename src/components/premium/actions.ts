"use server"

import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server"

export async function createCheckoutSession(priceId: string) {
    const user = await currentUser();

    if (!user) {
        throw new Error("You must be signed in to create a checkout session");
    }

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
        customer_email: user.emailAddresses[0].emailAddress,
        // Attach user data to checkout session
        subscription_data: {
            metadata: {
                userId: user.id,
            }
        },
        custom_text: {
            terms_of_service_acceptance: {
                message: `By clicking "Subscribe", you agree to our (AI Resume Builder) [Terms of Service](${process.env.NEXT_PUBLIC_BASE_URL}/tos).`,
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