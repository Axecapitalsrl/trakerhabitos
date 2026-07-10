-- =============================================================================
-- Habit Tracker — Migración inicial
-- Ejecutar en: Supabase Dashboard -> SQL Editor (o supabase db push)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles: extiende auth.users con datos de la app (1-a-1 por id).
-- Las contraseñas las maneja Supabase en auth.users; acá NO hay password_hash.
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text not null,
  name            text,
  role            text not null default 'user'
                    check (role in ('user', 'admin')),
  -- 'pending' = pendiente de aprobación manual del admin (fase actual).
  -- En fase 2 (billing) se podrán agregar estados como 'pending_payment'
  -- sin tocar el resto del esquema, gracias al CHECK extensible.
  status          text not null default 'pending'
                    check (status in ('pending', 'active', 'disabled')),
  -- Multi-tenancy futuro: hoy null para todos; no se implementa todavía.
  organization_id uuid,
  created_at      timestamptz not null default now(),
  approved_at     timestamptz,
  approved_by     uuid references auth.users (id)
);

-- -----------------------------------------------------------------------------
-- habits
-- -----------------------------------------------------------------------------
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null,
  description text,
  -- MVP: solo 'daily'. El campo queda para soportar 'weekly' en el futuro.
  frequency   text not null default 'daily'
                check (frequency in ('daily', 'weekly')),
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists habits_user_id_idx on public.habits (user_id);

-- -----------------------------------------------------------------------------
-- habit_logs: un registro por hábito y día.
-- -----------------------------------------------------------------------------
create table if not exists public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits (id) on delete cascade,
  date       date not null,
  completed  boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

create index if not exists habit_logs_habit_id_date_idx
  on public.habit_logs (habit_id, date);

-- =============================================================================
-- Trigger: crear profile automáticamente al registrarse un usuario.
-- Siempre nace como status='pending', role='user'.
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Trigger: impedir que un usuario común escale privilegios.
-- Un usuario NO puede cambiar su propio role / status / organization_id.
-- Solo el service_role (usado en operaciones admin del servidor) puede.
-- =============================================================================
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' then
    return new; -- operaciones admin del servidor: permitido.
  end if;

  if new.role is distinct from old.role
     or new.status is distinct from old.status
     or new.organization_id is distinct from old.organization_id then
    raise exception 'No autorizado a modificar role/status/organization_id';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_privilege_escalation on public.profiles;
create trigger prevent_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_privilege_escalation();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles   enable row level security;
alter table public.habits     enable row level security;
alter table public.habit_logs enable row level security;

-- --- profiles ---------------------------------------------------------------
-- Cada usuario ve y edita solo su propio profile.
-- (Las operaciones admin de listar/aprobar/desactivar usan el service_role
--  desde el servidor, que ignora RLS; por eso no hace falta policy de admin.)
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- --- habits -----------------------------------------------------------------
create policy "habits_select_own"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "habits_insert_own"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "habits_update_own"
  on public.habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habits_delete_own"
  on public.habits for delete
  using (auth.uid() = user_id);

-- --- habit_logs -------------------------------------------------------------
-- Un log pertenece al usuario dueño del hábito referenciado.
create policy "habit_logs_select_own"
  on public.habit_logs for select
  using (exists (
    select 1 from public.habits h
    where h.id = habit_logs.habit_id and h.user_id = auth.uid()
  ));

create policy "habit_logs_insert_own"
  on public.habit_logs for insert
  with check (exists (
    select 1 from public.habits h
    where h.id = habit_logs.habit_id and h.user_id = auth.uid()
  ));

create policy "habit_logs_update_own"
  on public.habit_logs for update
  using (exists (
    select 1 from public.habits h
    where h.id = habit_logs.habit_id and h.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.habits h
    where h.id = habit_logs.habit_id and h.user_id = auth.uid()
  ));

create policy "habit_logs_delete_own"
  on public.habit_logs for delete
  using (exists (
    select 1 from public.habits h
    where h.id = habit_logs.habit_id and h.user_id = auth.uid()
  ));
