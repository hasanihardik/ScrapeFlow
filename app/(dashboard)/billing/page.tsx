import { Suspense } from "react";
import { CreditPackageCard } from "./_components/CreditPackageCard";
import { PaymentHistory } from "./_components/PaymentHistory";
import { CREDIT_PACKAGES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Purchase Credits</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <CreditPackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <Suspense fallback={
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        }>
          <PaymentHistory />
        </Suspense>
      </div>
    </div>
  );
}
