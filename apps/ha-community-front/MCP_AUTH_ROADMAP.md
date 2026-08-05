# Authentification community — état des lieux

Suivi de l'adaptation de `ha-community-front` au nouveau modèle d'authentification de
`hn-community-api`. Contrat API complet : `AUTHENTICATION.md`.

Périmètre : `ha-community-front` uniquement. `ca-space-front`, `lab-front` et
`front-core-lib` ne sont pas touchés — `cn-space-api` reste sur le token de 7 jours.

---

## Le problème

Le back est passé d'un token d'accès unique de 7 jours à un couple **token d'accès
15 minutes + refresh token 30 jours**, tous deux en cookies `httpOnly`.

Sans adaptation du front, **les utilisateurs sont déconnectés toutes les 15 minutes**.
C'est le seul changement réellement obligatoire ; tout le reste en découle.

---

## Les trois idées à retenir

### 1. Un 401 ne veut plus dire « déconnecté »

Il veut dire « le token d'accès a expiré ». La session, elle, vit 30 jours. Le front
renouvelle et rejoue la requête, l'utilisateur ne voit rien.

### 2. C'est l'API qui sait, pas un cookie

Le front lisait un cookie pour décider qui est connecté. Il ne le fait plus côté
navigateur : il demande. Un cookie ne peut pas savoir qu'une session a été révoquée, ni
qu'un token expiré peut être renouvelé.

### 3. Sauf le rendu serveur, qui n'a pas le choix

Le serveur SSR doit produire le HTML immédiatement, il ne peut pas « demander et
attendre ». Or depuis le passage à 15 minutes, il n'a plus aucun signal :

- le `Authorization` qu'il reçoit est expiré et il ne peut pas le valider ;
- il ne reçoit **jamais** `Refresh_Token`, qui est en `Path=/auth` — une requête sur
  `/brick/xyz` ne le transporte pas ;
- il ne peut pas rafraîchir lui-même : les `Set-Cookie` renouvelés n'atteindraient pas le
  navigateur.

D'où un **cookie marqueur** (`Session_Active`, `Path=/`, `httpOnly`) posé par l'API, qui
lui dit seulement « une session existe peut-être ». Le serveur transmet ensuite sa réponse
au navigateur via `TransferState`, pour qu'un visiteur anonyme ne dépense pas d'appel
inutile.

> **La règle qui encadre le marqueur** — il a le droit de se tromper en disant « peut-être
> connecté », **jamais** en disant « pas connecté ». Il ne conclut jamais qu'une session est
> morte. C'est vrai tant que sa durée est ≥ celle du refresh token.

---

## Ce qui est fait

### Le renouvellement automatique

`ha-core/ha-service/ha-http-refresh-interceptor.service.ts`

Attrape le `401`, appelle `POST /auth/refresh`, rejoue la requête.

- **un seul refresh en vol à la fois** — la rotation est à usage unique, deux refresh
  concurrents déconnecteraient une session valide ;
- **un seul rejeu par requête** — pas de boucle ;
- **rien sur** `/auth/login`, `/auth/login-2fa`, `/auth/refresh`, `/auth/logout` ;
- **rien pendant le SSR** — le serveur ne peut pas transmettre les cookies renouvelés ;
- **`429` distinct du `401`** — « réessaie plus tard », jamais une déconnexion ;
- **tout échec de refresh vaut fin de session**, quel que soit le statut. Un `404` pendant
  le déploiement front-avant-back est donc géré sans cas particulier.

**Multi-onglets** : si le refresh échoue, la requête d'origine est rejouée une fois avant
de conclure. Le `401` de l'onglet perdant prouve que l'autre a déjà réussi sa rotation,
donc le nouveau token est déjà dans le pot de cookies partagé. Aucune coordination entre
onglets, et le back garde une rotation strictement à usage unique.

### Le déclencheur : statut, jamais code

`ha-core/ha-model/ha-config/ha-api-error.service.ts`

L'API utilise **deux codes** pour un `401` : `error.unauthorized` sur les routes protégées,
`error.wrong_token` seulement sur `/auth/refresh`. Un mécanisme branché sur le code serait
inerte, et ça ne se verrait qu'après 15 minutes d'usage réel.

Tout est donc piloté par le **statut**, avec deux exclusions : pas de marqueur (rien à
perdre — sinon boucle de rechargement infinie chez les visiteurs anonymes) et routes
`/auth/` (un mauvais mot de passe est un `401` aussi).

### La boucle OAuth / MCP corrigée

`ha-main/ha-login-page/ha-login-page.component.ts`

La page de login redirigeait vers `/oauth/authorize` sur la foi du marqueur. Token
expiré → l'API renvoyait sur `/login?returnUrl=…` → **boucle infinie**. Elle appelle
maintenant `refresh()` avant de rediriger.

### Le marqueur réduit au rendu serveur

Six endroits décidaient à partir du cookie. Cinq demandent maintenant à l'API :

| Endroit                           | Devenu                                                      |
| --------------------------------- | ----------------------------------------------------------- |
| chargement du profil au démarrage | appelle `/user`, sauf réponse SSR négative transmise        |
| `HaLoginGuard`, `HaStoryGuard`    | attendent `isAuthenticatedOnce()` ; cookie côté serveur     |
| `*haIsAuthenticated`              | suit `isAuthenticated()`, réagit donc aussi au login/logout |
| état du thème                     | s'appuie sur l'utilisateur résolu                           |
| page cli-auth                     | attend la réponse autoritative                              |

`HaAuthenticatedUserService` est l'autorité : `isAuthenticated()` reste silencieux tant que
la réponse est inconnue, pour qu'on ne confonde jamais « pas encore chargé » et « anonyme ».

### La charge anonyme

Le serveur lit le marqueur `httpOnly` et transmet sa réponse au navigateur
(`HA_SESSION_STATE_KEY`), consommée à la première lecture — sinon un `init()` après login
réutiliserait un « pas de session » périmé. Un visiteur anonyme ne déclenche donc aucun
appel.

Corollaire : les réponses SSR passent en `Cache-Control: no-store` (`server.ts`). Elles
portent un état par visiteur, et les règles existantes ne couvraient que les URLs finissant
par `.html` — ce qu'une route rendue n'est jamais.

### Couverture

**67 tests** répartis sur 8 fichiers, plus le lint. Les invariants les plus délicats — refresh
unique partagé, absence de boucle de rechargement — ont été vérifiés par mutation, en cassant
volontairement le code pour confirmer qu'un test l'attrape.

---

## Ce qui reste à faire

### 1. Tests en navigateur — bloquant avant déploiement

Rien n'a été validé contre un vrai back. Tout repose sur les tests automatisés.

Lancer le back avec `ACCESS_TOKEN_DURATION_SECONDS=60`, puis
`bunx nx serve ha-community-front` :

- [ ] se connecter, attendre > 60 s, naviguer → aucune déconnexion, un seul `/auth/refresh`
- [ ] page déclenchant plusieurs appels après expiration → **un seul** `/auth/refresh`
- [ ] deux onglets, laisser expirer, agir dans les deux → aucun déconnecté
- [ ] logout puis navigation → retour au login, pas de boucle
- [ ] flux MCP : rester connecté > 60 s puis lancer `/oauth/authorize` → pas de formulaire
- [ ] navigation privée → **aucun** appel `/user` ni `/auth/refresh`

### 2. Après déploiement du back

- [ ] supprimer l'écriture d'`Auth_Expiration` par le front (`HaAuthService.afterLogin`) et
      la constante `SESSION_MARKER_DURATION_MS`
- [ ] supprimer le repli sur `Auth_Expiration` dans
      `HaAuthenticatedUserService.hasSessionMarkerOnServer()`

Pas avant : le déploiement se fait **front d'abord, back ensuite**, et le front doit
fonctionner avec les deux versions du back.

### 3. Côté back (rappel)

- [ ] suite e2e écrite mais **jamais exécutée** — conteneur de base de test absent
- [ ] tokens MCP (`/oauth/*`) encore à 7 jours, chantier suivant, sans impact front

---

## Ordre de déploiement

**Front d'abord, back ensuite.** Les deux ordres ne sont pas symétriques :

- front d'abord, ancien back → le token vaut encore 7 jours, les `401` restent rares, et
  `/auth/refresh` répond `404`, traité comme une fin de session. Sans effet de bord.
- back d'abord → **toutes** les sessions meurent au bout de 15 minutes, sans recours.

Côté back, le `CREATE TABLE refresh_token` de `hn-migration.sql` doit tourner **avant** le
démarrage de l'app : le login en dépend.

Une déconnexion forcée aura lieu quel que soit l'ordre : les utilisateurs détiennent un
cookie de 7 jours sans refresh token. Elle s'étale sur une semaine plutôt que de survenir au
déploiement.

---

## Points de vigilance pour la suite

- **Ne jamais rebrancher une décision d'authentification sur un cookie côté navigateur.**
  C'est le défaut de conception qu'on vient de retirer.
- **Ne jamais brancher quoi que ce soit sur `error.wrong_token` seul.** Deux codes existent,
  un troisième peut apparaître.
- **Le marqueur ne doit jamais raccourcir sous la durée du refresh token.** Trop long : un
  appel inutile qui se corrige. Trop court : une déconnexion à tort.
- **Le refresh ne doit pas passer par `FlApiService`.** Son pipeline d'erreur recharge la
  page sur un `401`, l'appelant ne verrait jamais l'échec.
