import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/stripe";
import { CREDIT_PACKAGES } from "@/lib/constants";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId } = await req.json();
    const creditPlan = CREDIT_PACKAGES.find((p) => p.id === priceId);

    if (!creditPlan) {
      return new NextResponse("Invalid price ID", { status: 400 });
    }

    const session = await createCheckoutSession({
      userId,
      email: "user@example.com", // This will be overridden by Stripe Checkout
      priceId: creditPlan.id,
      credits: creditPlan.credits,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
