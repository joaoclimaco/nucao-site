-- NUCAO: banco + autenticação + storage para o acervo de lâminas.
-- Execute este arquivo inteiro no SQL Editor do seu projeto Supabase.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('viewer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.laminas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pathology text not null,
  tissue text,
  stain text,
  magnification text,
  description text,
  pathology_description text,
  key_findings jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  image_url text not null default './laminas/placeholder.svg',
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists laminas_set_updated_at on public.laminas;
create trigger laminas_set_updated_at
before update on public.laminas
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'viewer') on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.laminas enable row level security;

grant select on public.laminas to anon, authenticated;
grant select on public.profiles to authenticated;
grant insert, update, delete on public.laminas to authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Profiles are private" on public.profiles;
create policy "Profiles are private"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Public can read laminas" on public.laminas;
create policy "Public can read laminas"
on public.laminas for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert laminas" on public.laminas;
create policy "Admins can insert laminas"
on public.laminas for insert
 to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update laminas" on public.laminas;
create policy "Admins can update laminas"
on public.laminas for update
 to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete laminas" on public.laminas;
create policy "Admins can delete laminas"
on public.laminas for delete
 to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('laminas', 'laminas', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view lamina images" on storage.objects;
create policy "Public can view lamina images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'laminas');

drop policy if exists "Admins can upload lamina images" on storage.objects;
create policy "Admins can upload lamina images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'laminas' and public.is_admin());

drop policy if exists "Admins can update lamina images" on storage.objects;
create policy "Admins can update lamina images"
on storage.objects for update
to authenticated
using (bucket_id = 'laminas' and public.is_admin())
with check (bucket_id = 'laminas' and public.is_admin());

drop policy if exists "Admins can delete lamina images" on storage.objects;
create policy "Admins can delete lamina images"
on storage.objects for delete
to authenticated
using (bucket_id = 'laminas' and public.is_admin());

-- Primeira lâmina do acervo. A imagem permanece no projeto GitHub até você
-- poder substituí-la pelo upload do painel, se desejar.
insert into public.laminas (
  name, pathology, tissue, stain, magnification, description,
  pathology_description, key_findings, tags, image_url
)
select
  'Pigmentação por Amálgama',
  'Tatuagem por amálgama',
  'Mucosa oral',
  'Informação a confirmar',
  'Informação a confirmar',
  'Lâmina histológica demonstrativa de pigmentação por amálgama, destinada ao estudo da presença de material pigmentado associado aos tecidos da mucosa oral.',
  'A tatuagem por amálgama é uma pigmentação exógena adquirida decorrente da implantação de partículas de amálgama nos tecidos da mucosa oral. A descrição definitiva dos achados deve ser conferida com o material da disciplina ou do laboratório responsável pela lâmina.',
  '["Depósitos de material pigmentado", "Pigmentação no tecido conjuntivo"]'::jsonb,
  array['Pigmentação', 'Amálgama', 'Mucosa oral'],
  './laminas/tatuagem-amalgama.png'
where not exists (select 1 from public.laminas where pathology = 'Tatuagem por amálgama');
