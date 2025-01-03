"use client";

import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCustomerPortalSession } from "./action";

export default function ManageSubscription() {
  // Redirect to stripe billing portal
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);
      const redirectUrl = await createCustomerPortalSession();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
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
    <LoadingButton onClick={handleClick} loading={isLoading}>
      Manage Subscription
    </LoadingButton>
  );
}
