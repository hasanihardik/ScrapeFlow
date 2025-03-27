import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/database/prisma";
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payments = await prisma.$queryRaw`
      SELECT id, "userId", amount, credits, status, "stripePaymentId", "createdAt", "updatedAt"
      FROM "Payment"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("[PAYMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
