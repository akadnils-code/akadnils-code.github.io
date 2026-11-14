-- ALL IN ONE · Gestion des clients (abonnements) à la main — SQL Editor de Supabase
-- Paiement hors application (virement, Cash Plus, Wafacash, espèces) puis activation ici.

-- Voir tous les clients : entreprise, offre, statut, e-mail du propriétaire
select t.id, t.name, t.plan, t.status, u.email as proprietaire
from public.tenants t
left join public.memberships m on m.tenant_id = t.id and m.role = 'owner'
left join auth.users u on u.id = m.user_id
order by t.name;

-- Activité par client (nombre de commandes enregistrées)
select tenant_id, count(*) as commandes, max(updated_at) as derniere_activite
from public.orders where deleted_at is null group by tenant_id order by derniere_activite desc;

-- Suspendre un client qui n'a pas payé (remplace le nom)
-- update public.tenants set status = 'suspended' where name = 'NOM DE L''ENTREPRISE';

-- Réactiver après paiement (la valeur de plan doit être autorisée : voir contrôle n°5 du fichier de vérification)
-- update public.tenants set status = 'active' where name = 'NOM DE L''ENTREPRISE';
-- update public.tenants set plan = 'pro' where name = 'NOM DE L''ENTREPRISE';
