"use server";

import { revalidatePath } from "next/cache";
import { approveUser, requireAdmin, setUserStatus } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, type Plan } from "@/lib/plans";

export async function approveUserAction(userId: string): Promise<void> {
  const adminId = await requireAdmin();
  await approveUser(userId, adminId);
  revalidatePath("/admin");
}

export async function disableUserAction(userId: string): Promise<void> {
  const adminId = await requireAdmin();
  if (userId === adminId) {
    throw new Error("No podés desactivar tu propia cuenta de admin.");
  }
  await setUserStatus(userId, "disabled");
  revalidatePath("/admin");
}

export async function reactivateUserAction(userId: string): Promise<void> {
  await requireAdmin();
  await setUserStatus(userId, "active");
  revalidatePath("/admin");
}

export async function setUserPlanAction(
  userId: string,
  plan: Plan,
): Promise<void> {
  await requireAdmin();
  if (!(plan in PLANS)) throw new Error("Plan inválido");
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ plan }).eq("id", userId);
  revalidatePath("/admin");
}
