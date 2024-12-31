import { cache } from "react";
import prisma from "./prisma";
import { env } from "../env";

export type SubscriptionLevel = "free" | "pro" | "pro_plus";

// Using the cache function prevents the function from being called multiple times with the same arguments. 
// This is useful when you want to prevent multiple calls to the server for the same data.

export const getUserSubscriptionLevel = cache(
    async (userId: string) : Promise<SubscriptionLevel> => {
        const subscription = await prisma.userSubscription.findUnique({
            where: {
                userId
            }
        })

        if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
            return "free";
        }
        
        if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY) {
            return "pro";
        }

        if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
            return "pro_plus";
        }

        throw new Error("Invalid subscription")

    }
)