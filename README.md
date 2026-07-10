# Habit Tracker

App web para trackear hábitos diarios. Next.js (App Router) + TypeScript +
Tailwind. **Clerk** para auth y **Supabase (Postgres)** como base de datos.

## Stack

- **Frontend/Backend:** Next.js 16 (App Router) + TypeScript
- **Estilos:** Tailwind CSS v4
- **Auth:** Clerk
- **DB:** Supabase (Postgres). Acceso server-side con la service role key,
  filtrando por el userId de Clerk. RLS activo como backstop.

## Arquitectura de identidad

- La identidad la maneja **Clerk** (`profiles.id` = Clerk user id, texto).
- Al entrar por primera vez se crea el `profile` en Supabase con
  `status = 'pending'`. El admin lo aprueba (`active`) desde `/admin`.
- Todo el acceso a la DB es server-side (Server Components / Server Actions)
  con la service role key; nunca desde el navegador.

## Puesta en marcha

### 1. Crear la app en Clerk

1. Entrá a [clerk.com](https://clerk.com) → creá una aplicación.
2. Habilitá el método de ingreso que quieras (ej. Email + contraseña).
3. En **API Keys** copiá `Publishable key` y `Secret key`.

### 2. Base de datos en Supabase

1. Proyecto en [supabase.com](https://supabase.com) (si no lo tenés).
2. **SQL Editor** → ejecutá
   [`supabase/migrations/0002_switch_to_clerk.sql`](supabase/migrations/0002_switch_to_clerk.sql).
   > Esta migración resetea las tablas del `0001` (esquema Supabase-Auth) y las
   > recrea para Clerk. No la saltees si ya corriste el `0001`.
3. **Settings → API** → copiá `Project URL` y la `service_role` key.

### 3. Variables de entorno

```bash
cp .env.local.example .env.local
```

Completá `.env.local` con las claves de Clerk (paso 1), las de Supabase
(paso 2) y `SEED_ADMIN_EMAIL` (el email con el que te vas a registrar).

### 4. Levantar el proyecto

```bash
npm run dev
```

Abrí http://localhost:3000

### 5. Crear el admin

1. Registrate en la app (`/sign-up`) con el email de `SEED_ADMIN_EMAIL`.
   Vas a caer en la pantalla de "cuenta pendiente".
2. En otra terminal: `npm run seed` → tu cuenta pasa a `admin` / `active`.
3. Refrescá: ya entrás al panel y ves el link **Admin**.

## Estructura

```
src/
  app/
    dashboard/          # Panel del usuario (gate: status = active)
    sign-in, sign-up/   # Pantallas de Clerk
    pending, disabled/  # Estados de cuenta
  lib/
    supabase/admin.ts   # Cliente service-role (solo servidor)
    auth.ts             # Clerk userId -> profile (lo crea si no existe)
    types.ts            # Tipos del dominio
  middleware.ts         # Clerk middleware (protege /dashboard y /admin)
supabase/
  migrations/           # Esquema SQL (aplicar en Supabase)
scripts/
  seed-admin.ts         # Promueve a admin por email
```

## Seguridad

- Passwords y sesiones gestionadas por Clerk (nunca las tocamos).
- Acceso a la DB solo server-side con service role, filtrando por el userId de
  Clerk en cada query. RLS activo sin políticas permisivas (backstop).
- Gate de `status = active` (dashboard) y `role = admin` (/admin) en **cada**
  request, no solo en el login.
- Credenciales en variables de entorno (`.env.local`, ignorado por git).
