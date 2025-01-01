import { env } from "@/env";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const sig = req.headers.get("Stripe-Signature") || "";

        if (!sig) {
            return new Response("Missing Signature", { status: 400 });
        }

        const event = stripe.webhooks.constructEvent(payload, sig, env.STRIPE_WEBHOOK_SECRET);

        console.log(`received event: ${event.type}`, event.data.object)

        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case "customer.subscription.created":
            case "customer.subscription.updated":
                await handleSubscriptionCreatedOrUpdated(event.data.object.id);
                break;
            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }

        return new Response("Stripe event received.", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error.", { status: 500 });
    }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    // Handle checkout session completed event
    const userId = session.metadata?.userId;
    if (!userId) {
        throw new Error("UserId missing from session metadata.");
    }
    (await clerkClient()).users.updateUserMetadata(userId, {
        privateMetadata: {
            stripeCustomerId: session.customer as string,
        }
    })
}

async function handleSubscriptionCreatedOrUpdated(subscription: string) {
    // Handle subscription created or updated event
    console.log(`handleSubscriptionCreatedOrUpdated`)
}

async function handleSubscriptionDeleted(stripe: Stripe.Subscription) {
    // Handle subscription deleted event
    console.log(`handleSubscriptionDeleted`)
} 