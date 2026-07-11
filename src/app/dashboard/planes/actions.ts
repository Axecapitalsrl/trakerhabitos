"use server";

import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, priceIdFor } from "@/lib/stripe";
import type { Plan } from "@/lib/plans";

export interface CheckoutState {
  url?: string;
  error?: string;
}

export async function startCheckout(plan: Plan): Promise<CheckoutState> {
  const { userId } = await auth();
  if (!userId) return { error: "No autenticado." };

  const priceId = priceIdFor(plan);
  if (!priceId) {
    return { error: "Este plan todavía no está configurado para pago." };
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .maybeSingle<{ email: string; stripe_customer_id: string | null }>();

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch {
    return { error: "Los pagos todavía no están configurados." };
  }

  // Cliente de Stripe (uno por usuario).
  let customerId = profile?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email,
      metadata: { userId },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  const h = await headers();
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/dashboard/planes`,
    metadata: { userId, plan },
    subscription_data: { metadata: { userId, plan } },
  });

  return { url: session.url ?? undefined };
}
