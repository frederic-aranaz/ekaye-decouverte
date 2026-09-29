/**
 * Service worker — Découverte EKAYE
 *
 * Son seul rôle : que la page s'OUVRE sans réseau. Sans lui, une page hébergée en
 * ligne ne s'affiche pas hors connexion, et la file d'attente ne servirait qu'aux
 * coupures survenues onglet déjà ouvert — c'est-à-dire pas au cas qui compte :
 * arriver sur un stand sans réseau et vouloir saisir un contact.
 *
 * À CHAQUE PUBLICATION D'UNE NOUVELLE VERSION DE LA PAGE, incrémenter VERSION.
 * Sans cela, les téléphones qui ont déjà installé la page continueront de servir
 * l'ancienne indéfiniment : c'est le seul piège de ce fichier.
 */

var VERSION = 'v10';  // v10 : le refus de clé dit où chercher (29/09/2026)
var CACHE = 'ekaye-decouverte-' + VERSION;

var FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icone.svg',
  'icone-maskable.svg',
  'apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  // skipWaiting : la nouvelle version prend la main au prochain chargement plutôt
  // qu'après fermeture de tous les onglets. Sur un téléphone, « tous les onglets »
  // peut vouloir dire jamais.
  e.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(FICHIERS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (noms) {
        return Promise.all(noms.map(function (nom) {
          if (nom !== CACHE) return caches.delete(nom);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var requete = e.request;

  // On ne touche QUE nos propres fichiers, en lecture. Les appels au script Google
  // sont des POST cross-origin : les intercepter n'apporterait rien et risquerait
  // de servir une réponse périmée à un envoi de fiche.
  if (requete.method !== 'GET') return;
  if (new URL(requete.url).origin !== self.location.origin) return;

  // Réseau d'abord, cache en secours : en ligne, on a toujours la dernière version
  // publiée ; hors ligne, la page s'ouvre quand même. L'inverse (cache d'abord)
  // servirait plus vite mais ferait traîner les corrections pendant des jours.
  e.respondWith(
    fetch(requete)
      .then(function (reponse) {
        if (reponse && reponse.status === 200 && reponse.type === 'basic') {
          var copie = reponse.clone();
          caches.open(CACHE).then(function (cache) { cache.put(requete, copie); });
        }
        return reponse;
      })
      .catch(function () {
        return caches.match(requete).then(function (enCache) {
          if (enCache) return enCache;
          // Navigation sans correspondance exacte (une URL avec paramètres, par
          // exemple) : on rend la page d'accueil, qui est l'application entière.
          if (requete.mode === 'navigate') return caches.match('index.html');
          return Response.error();
        });
      })
  );
});
