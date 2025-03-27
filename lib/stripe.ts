import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const getStripeCustomer = async (userId: string) => {
  const customers = await stripe.customers.search({
    query: `metadata['userId']:'${userId}'`,
    limit: 1
  });
  
  return customers.data[0];
};

export const createStripeCustomer = async (userId: string, email: string) => {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });
  
  return customer;
};

export const createCheckoutSession = async ({
  userId,
  email,
  priceId,
  credits,
}: {
  userId: string;
  email: string;
  priceId: string;
  credits: number;
}) => {
  let customerId: string;
  const existingCustomer = await getStripeCustomer(userId);

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const customer = await createStripeCustomer(userId, email);
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true&credits=${credits}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=false`,
    metadata: {
      userId,
      credits,
    },
  });

  return checkoutSession;
};
