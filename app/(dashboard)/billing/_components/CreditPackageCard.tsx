"use client";

import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface CreditPackage {
  id: string;
  credits: number;
  amount: number;
  popular: boolean;
  description: string;
}

export function CreditPackageCard({ pkg }: { pkg: CreditPackage }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: pkg.id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`p-6 ${pkg.popular ? "border-primary" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold">{pkg.credits.toLocaleString()} Credits</h3>
          <p className="text-muted-foreground">{pkg.description}</p>
        </div>
        {pkg.popular && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Most Popular
          </span>
        )}
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold">${pkg.amount}</span>
        <span className="text-muted-foreground ml-1">USD</span>
      </div>

      <Button
        className="w-full"
        variant={pkg.popular ? "default" : "outline"}
        disabled={isLoading}
        onClick={handlePurchase}
      >
        {isLoading ? "Processing..." : "Purchase Credits"}
      </Button>
    </Card>
  );
}
