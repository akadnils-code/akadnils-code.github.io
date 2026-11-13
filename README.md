# All In One — Amk Logistique (v8.5.0)
Application web installable (PWA) de confirmation, livraison et suivi des commandes paiement à la livraison (COD) au Maroc.
Données chiffrées sur le téléphone, suivi en direct et import automatique via Firebase (facultatifs).

## Fichiers à mettre à la racine du dépôt GitHub
index.html · styles.css · app.js · cloud.js · sw.js · manifest.webmanifest · privacy.html · icon-192.png · icon-512.png · icon-512-maskable.png
Hors site : import-gmail.gs (Google Apps Script), GUIDE-MISE-EN-SERVICE.md, README.md.

## Mise à jour depuis Android
1. GitHub > dépôt > Add file > Upload files : envoyer les fichiers ci-dessus, puis Commit changes.
2. Rouvrir l'appli deux fois (mise à jour du cache). Le numéro de version s'affiche en haut.

## Changements v8.5.0 (réorganisation)
- En-tête : ta photo (ou tes initiales) ouvre Mon profil.
- Menu Compte regroupé : Pilotage de l’activité · Développement commercial · Outils terrain · Prospection · Profil & paramètres.
- Réglages en 4 volets : Profil · Activité (tarifs, messages) · Sécurité (code, biométrie, sauvegarde) · Connexions (suivi, import, cloud).
- Doublons supprimés : livreurs (une seule gestion, dans Réseau professionnel), formulaire d’article (Catalogue produits), export Excel (Finances), tableaux ville/canal (Finances), mémo de rappel (Relances WhatsApp), avis clients (une seule note moyenne, dans Livraison → Preuves & avis).
- Nom, société, téléphone, e-mail et ville du profil alimentent l’accueil et les relevés de commissions.

## Changements v8.4.0 (profil)
- Réglages → onglet **Profil** : carte de profil (photo, nom, fonction, société, téléphone/WhatsApp, e-mail, ville, Instagram), enregistrement, « Ajouter à mes contacts » (.vcf) et partage.
- Le nom, le téléphone, l’Instagram et le RIB sont ceux déjà utilisés pour les relevés et les liens vendeurs.

## Changements v8.1.2 (étape 0 : filet de sécurité)
- Version alignée partout (appli, cache du service worker, README).
- Restauration : une copie des données actuelles est téléchargée avant de les remplacer ; avertissement si la sauvegarde chiffrée est restaurée sans code activé.

## Changements v8.2.0 (étape 1 : fondations cloud)
- Nouveau fichier cloud.js : compte, création d’entreprise et copie des données vers Supabase (Réglages → Compte cloud).
- L’application reste locale d’abord ; le cloud est pour l’instant une copie. Voir supabase/GUIDE-ETAPE-1.md.

## Changements v8.3.0 (étape 2a : synchronisation)
- Synchronisation automatique entre appareils (commandes, vendeurs, livreurs, paiements, liste noire) : Réglages → Compte cloud → Synchronisation.
- Dernier envoi gagne, par enregistrement ; une modification locale non envoyée n’est jamais écrasée. Les images restent locales (étape 2c).

## Fonctions
Appels et WhatsApp « en un mot » avec mémo de rappel · commandes · suivi de livraison (carte, simulation, preuve photo GPS) · avis 1 à 5 · finances et rapport hebdomadaire · import automatique · verrouillage par code, empreinte ou visage · arabe / anglais (partiel).

## Sécurité
- Code de livraison limité à 3 essais par mission (blocage 30 min), appliqué dans l'appli.
- Verrouillage par code PIN (chiffrement AES-GCM) ; empreinte / visage via le système du téléphone, sans jamais quitter l'appareil.

## Limites connues
- La limite des 3 essais est appliquée dans l'appli, pas côté serveur : une protection serveur complète demande une Cloud Function Firebase.
- Les réponses WhatsApp des clients ne sont pas lues automatiquement (API WhatsApp Business payante).
- NFC, caméra, GPS et Firebase réels : à tester sur de vrais téléphones. Le NFC ne fonctionne pas sur iPhone.
- Conformité loi 09-08 : voir GUIDE-MISE-EN-SERVICE.md (déclaration CNDP et autorisation de transfert à faire).
