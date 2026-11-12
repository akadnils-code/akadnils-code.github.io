# Confirmation COD 7.7.0
Application web installable (PWA) : données locales + suivi Firebase facultatif.

## Fichiers à mettre à la racine du dépôt GitHub
index.html · styles.css · app.js · sw.js · manifest.webmanifest · privacy.html · icon-192.png · icon-512.png · icon-512-maskable.png
Hors site : database_rules.json (à coller dans Firebase > Realtime Database > Règles), RAPPORT-MODIFICATIONS.md, README.md.

## Mise à jour depuis Android
1. GitHub > dépôt > Add file > Upload files : envoyer TOUS les fichiers, puis Commit changes.
2. Firebase : coller database_rules.json, tester dans le Simulateur, Publier.
3. Rouvrir l'appli deux fois (mise à jour du cache).

## À compléter
[NOM / SOCIÉTÉ] et [E-MAIL DE CONTACT] dans privacy.html.
## Limites
Pas de limite d'essais du code de livraison côté serveur ; NFC, caméra et Firebase réels non testés. Détails : RAPPORT-MODIFICATIONS.md.
