"use server";

import prisma from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

const GetAvailableCredit = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("no user found");
  }
  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });
  if (!balance) {
    // Create new balance with default credits (300)
    const newBalance = await prisma.userBalance.create({
      data: {
        userId,
        credits: 300
      }
    });
    return newBalance.credits;
  }
  return balance.credits;
};
export default GetAvailableCredit;
