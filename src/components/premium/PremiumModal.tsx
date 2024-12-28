"use client";

import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";

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

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
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
              <Button>Get Premium</Button>
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

              <Button variant="premium">Get Premium Plus</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
