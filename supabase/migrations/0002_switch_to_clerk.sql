-- =============================================================================
-- Migración: pasar de Supabase Auth a Clerk.
--
-- La identidad ahora la maneja Clerk. Los IDs de usuario pasan a ser TEXT
-- (ej. "user_2abc...") en vez de uuid con FK a auth.users.
--
-- El acceso a la DB se hace server-side con la service_role key, filtrando por
-- el userId de Clerk en cada query. RLS queda activo SIN políticas permisivas:
-- eso deniega todo acceso con la anon key y solo deja pasar al service_role
-- (que ignora RLS). Es un backstop seguro para el MVP.
--
-- Ejecutar en: Supabase Dashboard -> SQL Editor.
-- Ojo: DROP TABLE elimina las tablas del 0001 (no hay datos que perder).
-- =============================================================================

-- Limpieza de la versión Supabase-Auth (0001).
drop trigger  if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop trigger  if exists prevent_privilege_escalation on public.profiles;
drop function if exists public.prevent_privilege_escalation();

drop table if exists public.habit_logs cascade;
drop table if exists public.habits      cascade;
drop table if exists public.profiles    cascade;

-- -----------------------------------------------------------------------------
-- profiles: un registro por usuario de Clerk.
-- id = Clerk user id (text). No hay password acá (la maneja Clerk).
-- -----------------------------------------------------------------------------
create table public.profiles (
  id              text primary key,            -- Clerk user id
  email           text not null,
  name            text,
  role            text not null default 'user'
                    check (role in ('user', 'admin')),
  -- 'pending' = pendiente de aprobación manual del admin (fase actual).
  -- Extensible a 'pending_payment' etc. en fase 2 sin tocar el esquema.
  status          text not null default 'pending'
                    check (status in ('pending', 'active', 'disabled')),
  organization_id uuid,                          -- multi-tenancy futuro (hoy null)
  created_at      timestamptz not null default now(),
  approved_at     timestamptz,
  approved_by     text                           -- Clerk user id del admin
);

-- -----------------------------------------------------------------------------
-- habits
-- -----------------------------------------------------------------------------
create table public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null references public.profiles (id) on delete cascade,
  name        text not null,
  description text,
  frequency   text not null default 'daily'
                check (frequency in ('daily', 'weekly')),
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index habits_user_id_idx on public.habits (user_id);

-- -----------------------------------------------------------------------------
-- habit_logs: un registro por hábito y día.
-- -----------------------------------------------------------------------------
create table public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits (id) on delete cascade,
  date       date not null,
  completed  boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

create index habit_logs_habit_id_date_idx
  on public.habit_logs (habit_id, date);

-- -----------------------------------------------------------------------------
-- RLS activo, sin políticas: solo el service_role (server-side) accede.
-- -----------------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.habits     enable row level security;
alter table public.habit_logs enable row level security;
