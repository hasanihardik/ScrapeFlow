import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/database/prisma";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

async function updateUserCredits(userId: string, credits: number) {
  const userBalance = await prisma.userBalance.upsert({
    where: {
      userId: userId
    },
    update: {
      credits: {
        increment: credits
      }
    },
    create: {
      userId: userId,
      credits: credits
    }
  });
  return userBalance;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("No stripe signature found", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const error = err as Error;
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0");

    if (!userId) {
      return new NextResponse("User ID not found in session metadata", { status: 400 });
    }

    try {
      // Create payment record using raw query
      await prisma.$executeRaw`
        INSERT INTO "Payment" ("id", "userId", "amount", "credits", "status", "stripePaymentId", "createdAt", "updatedAt")
        VALUES (uuid_generate_v4(), ${userId}, ${session.amount_total || 0}, ${credits}, 'completed', ${session.payment_intent as string}, NOW(), NOW())
      `;

      // Update user credits and log result
      const updatedBalance = await updateUserCredits(userId, credits);
      console.log('Updated user balance:', updatedBalance);

      return new NextResponse(null, { status: 200 });
    } catch (err) {
      const error = err as Error;
      console.error("Error processing webhook:", error);
      return new NextResponse("Error processing webhook", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
