-- ALL IN ONE · Étape 2d : webhook universel (à exécuter une fois dans Supabase → SQL Editor)
-- Une clé secrète par entreprise ; seule l'Edge Function « webhook » (clé service) peut la lire.

create table if not exists public.webhook_keys (
  tenant_id      uuid primary key references public.tenants(id) on delete cascade,
  key            text not null unique check (key ~ '^[A-Za-z0-9]{16,64}$'),
  default_vendor text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.webhook_keys enable row level security;
revoke all on public.webhook_keys from anon, authenticated;
-- Aucune policy volontairement : personne côté application ne peut lire les clés.

create or replace function public.register_webhook_key(p_tenant uuid, p_key text, p_vendor text default '')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Accès refusé'; end if;
  if not exists (
    select 1 from public.memberships m
    where m.tenant_id = p_tenant and m.user_id = auth.uid() and m.role in ('owner','admin')
  ) then
    raise exception 'Accès refusé';
  end if;
  if p_key !~ '^[A-Za-z0-9]{16,64}$' then raise exception 'Clé invalide'; end if;

  insert into public.webhook_keys (tenant_id, key, default_vendor)
  values (p_tenant, p_key, left(coalesce(p_vendor, ''), 60))
  on conflict (tenant_id) do update
    set key = excluded.key, default_vendor = excluded.default_vendor, updated_at = now();
end;
$$;

revoke all on function public.register_webhook_key(uuid, text, text) from public, anon;
grant execute on function public.register_webhook_key(uuid, text, text) to authenticated;
