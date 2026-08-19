# Découverte EKAYE

Formulaire de prise de contact clients de l'atelier EKAYE (luminaires et vitraux sur
mesure, Libourne & Bergerac), utilisé à l'atelier, en exposition et à la boutique LAM
de Bergerac.

## Fonctionnement

Page statique installable sur l'écran d'accueil d'un téléphone. Elle **fonctionne sans
réseau** : les fiches saisies hors connexion sont gardées sur l'appareil et repartent
seules dès que la connexion revient. Les données sont enregistrées dans un classeur
Google Sheets privé, via un script Apps Script qui n'est pas dans ce dépôt.

## Accès

Ce dépôt est public parce que GitHub Pages l'exige, mais **il ne contient aucune donnée
et aucun secret** :

- l'adresse de l'API seule ne donne accès à rien ;
- toute requête exige une clé partagée, saisie une fois sur chaque téléphone et
  conservée uniquement dans le stockage local du navigateur ;
- sans cette clé, le script refuse tout.

## Consentement

La case « recevoir les actualités » n'inscrit personne : elle déclenche l'envoi d'un
email de confirmation. Tant que la personne n'a pas cliqué dans cet email, aucune
newsletter ne lui est envoyée (double opt-in).

## Publication

Le site est servi par GitHub Pages depuis la branche `main`.

⚠️ **Toute nouvelle publication exige d'incrémenter `VERSION` dans `sw.js`.** Sans cela,
les téléphones qui ont déjà installé la page continueront de servir l'ancienne version
indéfiniment.
