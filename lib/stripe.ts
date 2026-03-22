import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const PLANS = {
  FREE: {
    name: "Free",
    maxPages: 3,
    priceId: null,
  },
  PREMIUM: {
    name: "Premium",
    maxPages: Infinity,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
  },
} as const;

export type PlanType = keyof typeof PLANS;
