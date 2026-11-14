-- ALL IN ONE · Contrôles de sécurité Supabase (lecture seule — à lancer dans SQL Editor avant de vendre)

-- 1) Tables publiques SANS protection RLS. Résultat attendu : 0 ligne.
select tablename from pg_tables where schemaname = 'public' and not rowsecurity;

-- 2) Règles d'accès par table (relis-les : chaque règle doit filtrer par entreprise/membre).
select tablename, policyname, cmd, roles, qual
from pg_policies where schemaname = 'public' order by tablename, policyname;

-- 3) Droits donnés aux visiteurs non connectés (anon). Résultat attendu : aucune table de données.
select table_name, privilege_type
from information_schema.role_table_grants
where grantee = 'anon' and table_schema = 'public' order by 1, 2;

-- 4) Fonctions exposées (security definer = s'exécute avec des droits élevés : doivent toutes tester auth.uid()).
select routine_name, security_type
from information_schema.routines where routine_schema = 'public' order by 1;

-- 5) Contenu autorisé pour tenants.plan / status (pour savoir quelles valeurs tu peux utiliser).
select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.tenants'::regclass;
