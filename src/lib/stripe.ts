import "server-only";
import Stripe from "stripe";
import type { Plan } from "@/lib/plans";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta STRIPE_SECRET_KEY en el entorno.");
  return new Stripe(key);
}

/** Price ID de Stripe por plan (se configuran en el entorno). */
export function priceIdFor(plan: Plan): string | undefined {
  switch (plan) {
    case "starter":
      return process.env.STRIPE_PRICE_STARTER;
    case "pro":
      return process.env.STRIPE_PRICE_PRO;
    case "premium":
      return process.env.STRIPE_PRICE_PREMIUM;
    default:
      return undefined;
  }
}

/** Mapea un Price ID de Stripe de vuelta al plan. */
export function planForPriceId(priceId: string | null): Plan | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return "premium";
  return null;
}
