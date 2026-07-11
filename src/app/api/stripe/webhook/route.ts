import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe, planForPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/lib/plans";

export const runtime = "nodejs";

async function setPlanByCustomer(customerId: string, plan: Plan) {
  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ plan })
    .eq("stripe_customer_id", customerId);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("Firma de webhook inválida", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as Plan | undefined;
        const customerId = session.customer as string | null;
        const supabase = createAdminClient();
        if (userId && plan) {
          await supabase
            .from("profiles")
            .update({ plan, stripe_customer_id: customerId })
            .eq("id", userId);
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id ?? null;
        const plan = planForPriceId(priceId);
        const active = sub.status === "active" || sub.status === "trialing";
        await setPlanByCustomer(
          sub.customer as string,
          active && plan ? plan : "free",
        );
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await setPlanByCustomer(sub.customer as string, "free");
        break;
      }
    }
  } catch (err) {
    console.error("Error procesando webhook", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
