"use client";

import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCheckoutSession } from "./actions";

const premiumFeatures = [
  "AI tools",
  "Up to 3 resumes",
  "Unlimited downloads",
  "Customizable themes",
  "Cover letter builder",
  "No ads",
];

const premiumPlusFeatures = ["All Premium Features", "Unlimited resumes"];

export default function PremiumModal() {
  const { isOpen, setOpen } = usePremiumModal();

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  async function handlePremiumClick(priceId: string) {
    try {
      setIsLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: `Something went wrong while trying to get premium. Please try again later.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!isLoading) {
          setOpen(isOpen);
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume Builder AI Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get a premium subscription to unlock more features.</p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <ul className="list-inside space-y-2">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!,
                  )
                }
                disabled={isLoading}
              >
                Get Premium
              </Button>
            </div>
            <div className="border-1 mx-6" />
            <div className="flex w-1/2 flex-col justify-between space-y-5">
              <h3 className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium Plus
              </h3>
              <div className="h-full">
                <ul className="list-inside space-y-2">
                  {premiumPlusFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="premium"
                onClick={() =>
                  handlePremiumClick(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY!,
                  )
                }
                disabled={isLoading}
              >
                Get Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
