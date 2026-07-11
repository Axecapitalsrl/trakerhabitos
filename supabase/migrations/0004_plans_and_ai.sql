-- =============================================================================
-- Migración: planes (billing) + funciones de IA.
--
-- - Agrega el plan del usuario y datos de Stripe al profile.
-- - Contador mensual de planes personalizados generados (para el tope del Pro).
-- - Tabla de planes personalizados generados por IA.
-- - Tabla de mensajes del asistente (historial del chat).
--
-- Ejecutar en: Supabase Dashboard -> SQL Editor.
-- =============================================================================

alter table public.profiles
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'starter', 'pro', 'premium')),
  add column if not exists stripe_customer_id text,
  -- uso del plan personalizado en el período actual (para el tope mensual del Pro)
  add column if not exists ai_plans_used integer not null default 0,
  add column if not exists ai_plans_period text; -- 'YYYY-MM'

-- Planes personalizados generados por IA (Sonnet 5)
create table if not exists public.habit_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null references public.profiles (id) on delete cascade,
  content    text not null,          -- el plan en markdown
  answers    jsonb,                  -- respuestas del cuestionario
  created_at timestamptz not null default now()
);
create index if not exists habit_plans_user_id_idx on public.habit_plans (user_id);

-- Mensajes del asistente de hábitos (Haiku 4.5) — historial del chat
create table if not exists public.assistant_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null references public.profiles (id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists assistant_messages_user_id_idx
  on public.assistant_messages (user_id, created_at);

-- RLS activo, sin políticas: solo el service_role (server-side) accede.
alter table public.habit_plans        enable row level security;
alter table public.assistant_messages enable row level security;
