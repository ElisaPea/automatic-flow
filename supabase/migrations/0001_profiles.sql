-- Perfil de aplicación enlazado al usuario de Clerk.
create table if not exists public.profiles (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  display_name  text check (char_length(display_name) <= 80),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS activado SIN políticas: la tabla no es accesible vía PostgREST/anon key.
-- Solo el backend (rol postgres, que ignora RLS) lee y escribe.
alter table public.profiles enable row level security;
