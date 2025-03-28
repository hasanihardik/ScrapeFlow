"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@ui/skeleton";

interface Payment {
  id: string;
  amount: number;
  credits: number;
  status: string;
  createdAt: string;
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/payments");
        const data = await response.json();
        setPayments(data.payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Credits</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {format(new Date(payment.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
            <TableCell>{payment.credits.toLocaleString()}</TableCell>
            <TableCell className="capitalize">{payment.status}</TableCell>
          </TableRow>
        ))}
        {payments.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No payment history available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
