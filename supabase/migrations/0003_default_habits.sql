-- =============================================================================
-- Migración: hábitos predeterminados por usuario.
--
-- Agrega un flag para sembrar una sola vez los hábitos por defecto la primera
-- vez que el usuario entra al dashboard. Así no se re-crean si después
-- archiva/borra alguno.
--
-- Ejecutar en: Supabase Dashboard -> SQL Editor.
-- =============================================================================

alter table public.profiles
  add column if not exists defaults_seeded boolean not null default false;
