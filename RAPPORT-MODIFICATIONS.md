
# Version 7.6.0 : structure des fichiers
`index.html` (page), `styles.css` (styles), `app.js` (logique), `sw.js` (cache cod-v13, liste mise à jour), `manifest.webmanifest`, `privacy.html`, `database_rules.json`. Logique inchangée : le code a seulement été déplacé. Syntaxe JS vérifiée ; aucun navigateur disponible ici, donc affichage non testé.

# Version 7.5.0 : code de livraison vérifié par le serveur

- Code de livraison : 6 chiffres ALÉATOIRES (plus calculé à partir de l'identifiant). Il n'est que dans le lien client.
- Le vendeur publie le code dans `/secret/<id>/ck` (illisible par tout le monde, écriture unique).
- Le livreur envoie le code saisi (`dc`) avec `s=3` : les règles Firebase comparent au secret. Mauvais code = écriture refusée.
- Une livraison validée ne peut plus être remise à un statut inférieur.
- Règles : ajout des champs `rt`, `fb`, `rq` (avis/demandes client, bloqués avant).

## NON testé / limites
- Règles jamais exécutées (émulateur ou console Firebase > Règles > Simulateur à faire).
- Pas de limitation de tentatives côté serveur (6 chiffres = 1 000 000 essais).
- Sans Firebase activé, la validation par code est refusée (plus de contrôle local).
- Anciennes commandes déjà liées : renvoyer le lien client pour publier leur secret.
- Le secret est publié à la création du lien : le générer avant de donner le lien livreur.


---
# Historique 7.1.0 → 7.4.0
# Rapport de modifications – Confirmation COD 7.1.0 → 7.4.0

Originaux conservés : `sauvegarde-originale/`. Diffs complets : `modifications-index.diff`, `modifications-sw.diff`.

## Modifications
| # | Changement | Testé (Chromium headless, 390 px) |
|---|---|---|
| 1 | Paiements vendeur : conflit `padd`/`pdel` supprimé | ajout + suppression OK |
| 2 | Suivi client : variable `e` masquée (`e is not a function`) | étapes affichées, 0 erreur JS |
| 3 | XSS : prix catalogue, montant livreur, prix importés forcés en nombres | `<img onerror>` non exécuté |
| 4 | `today()` en heure locale (plus UTC) | date correcte |
| 5 | Restauration : confirmation avant écrasement | non automatisé |
| 6 | Service worker : pas de cache des liens `?t= ?l= ?v=`, cache `cod-v11` | syntaxe seulement |
| 7 | QR code hors ligne (lib MIT Kazuhiko Arase) : fiche vendeur, suivi client, mission livreur, enregistrement SVG | QR affiché ; décodage OpenCV identique (29 et 73 modules) |
| 8 | NFC : écriture/lecture de lien (liens de l'appli uniquement) | seulement le repli sans NFC |
| 9 | Code d'accès : 8 caractères minimum, 600 000 itérations PBKDF2 (anciens codes toujours acceptés) | refus < 8 car., chiffrement, verrouillage, déverrouillage OK |
| 10 | Sauvegarde chiffrée si code actif + restauration avec code | aucun texte clair dans le fichier ; restauration OK |
| 11 | Livraison signalée à distance : validation du vendeur (réglable dans Automatisations, activé par défaut) | statut reste « En cours » jusqu'à validation |
| 13 | Accueil : carte « QR code & NFC » (mon application, lien de commande par vendeur, mission par livreur, lecture de tag NFC) | affichage, 3 QR décodés par OpenCV, repli NFC |
| 12 | `firebase/database.rules.json` : règles proposées | JSON valide **uniquement** |

## NON résolu / NON testé
- **Faille majeure :** le code de livraison est toujours calculable par le livreur et la base Firebase accepte les écritures de quiconque détient un lien. Le point 11 limite l'impact financier, il ne supprime pas la faille. Correctif réel = vérification côté serveur (Firebase Auth + règles ou fonction cloud).
- Règles Firebase (12) : jamais exécutées. À essayer dans l'émulateur Firebase avant production (elles peuvent bloquer des écritures de l'appli).
- Non testés : NFC réel, scan QR au téléphone, Firebase réel, GPS, Leaflet, mise à jour du service worker sur appareil, impression.
- Non fournis : comptes et rôles, paiement en ligne, conformité loi 09-08, conditions d'utilisation (à faire valider par un juriste).
- Fichiers jamais reçus : `manifest.webmanifest`, icônes, `privacy.html`.
- L'essai gratuit (30 commandes) donne un bonus de livraison de 0 dh : comportement existant, inchangé.

## Contrôle indépendant conseillé
1. Lire les `.diff`. 2. Rejouer les tests ci-dessus sur un vrai téléphone Android et un iPhone. 3. Faire auditer la partie Firebase.

## Version 7.4.0 : modules NFC et QR code

| Fonction | Où | Test (Chromium headless, caméra et NFC simulés) |
|---|---|---|
| Diagnostic (https, NFC, caméra, lecteur QR, Firebase, permissions) | Accueil → Diagnostic | affichage OK |
| Association d'un tag NFC à un vendeur, livreur, client ou commande | Accueil → Associer un tag ; bouton « Tag NFC » sur les cartes de commande | QR du tag décodé = `?go=ve.<id>` ; écriture NDEF simulée OK |
| Ouverture automatique de la fiche (`?go=`) | lecture NFC, scan QR ou lien | vendeur, commande, livreur, client OK ; URL nettoyée |
| QR unique par colis | cartes Livraison et liste des commandes confirmées (« QR colis ») | décodé OpenCV |
| Scanner caméra (BarcodeDetector) | Accueil → Scanner un QR ; page livreur | flux simulé OK |
| Vendeur scanne un colis : « Remis au livreur » (avec confirmation) | Accueil | statut 1→2, PATCH Firebase unique |
| Livreur scanne le colis : « Récupéré » | page livreur | PATCH s=2 |
| Livreur scanne le QR de livraison du client | page livreur ; QR affiché sur la page client à l'étape « en route » | PATCH s=3 |
| Anti-doublon et anti-erreur | tous les scans | doublons refusés sans second PATCH ; mauvais colis et mauvais code refusés |
| Secours sans lecteur natif / caméra refusée / sans https | fenêtre du scanner | messages affichés ; saisie manuelle OK |

Régression : paiements, suivi client, XSS, chiffrement, sauvegarde chiffrée, validation des livraisons à distance, QR de l'accueil : tous rejoués sans erreur JS.

### Limites à connaître
- Le NFC et la caméra réels n'ont PAS été testés : ils exigent ton téléphone (Chrome Android, https, tag NTAG213 ou supérieur).
- Le QR de livraison et le code à 4 chiffres reposent toujours sur le même secret calculable par le livreur : le scan améliore le confort et évite les doublons, pas la sécurité. La vraie protection exige une vérification serveur.
- La synchronisation Firebase a été testée avec un faux serveur (requêtes PATCH capturées), pas avec un vrai projet.
- Un tag ou un QR « fiche » (`?go=`) ne s'ouvre que sur le téléphone qui contient les données.
- Le NFC ne peut pas être lu en arrière-plan : il faut appuyer sur « Lire un tag NFC » (contrainte de Chrome).
