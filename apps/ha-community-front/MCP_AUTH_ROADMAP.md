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

D'où un **cookie marqueur**, `Path=/`, `httpOnly`, qui lui dit seulement « une session
existe peut-être ». Le serveur transmet ensuite sa réponse au navigateur via
`TransferState`, pour qu'un visiteur anonyme ne dépense pas d'appel inutile.

C'est `Session_Active`, posé par l'API. **Écrit mais pas déployé** : il vit sur la branche
`feat/mcp-community` de `monorepo-back`, pas encore mergée dans `master`
(`hn-auth.controller.ts`, `hn-jwt.config.ts`). En attendant le front continue d'écrire
`Auth_Expiration` lui-même, et le serveur accepte les deux (voir « Après déploiement du back »).

Le contrat côté back est vérifié et conforme à ce que le front attend : `Path=/`, `httpOnly`,
`maxAge` = durée du refresh token, valeur constante `1`, reposé à **chaque** rotation (`sendSession`
est partagé par `login`, `login-2fa` et `refresh`) et effacé au `logout`.

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
- **`429` distinct du `401`** — sur la requête d'origine, « réessaie plus tard » ne déclenche
  aucun refresh et n'est jamais lu comme une fin de session. Sur `/auth/refresh` lui-même, en
  revanche, voir « Décisions prises » ;
- **aucun statut de refresh n'est traité à part** — tout échec suit le même chemin : un rejeu,
  puis l'erreur remonte. Un `404` pendant le déploiement front-avant-back est donc géré sans
  cas particulier.

**Un échec de refresh ne conclut jamais rien lui-même** — ni ici, ni sur le marqueur. C'est
`HaApiErrorService`, sur le `401` du rejeu, qui décide de la fin de session.

**Multi-onglets** : si le refresh échoue, la requête d'origine est rejouée une fois avant
de conclure. Le `401` de l'onglet perdant prouve que l'autre a déjà réussi sa rotation,
donc le nouveau token est déjà dans le pot de cookies partagé. Aucune coordination entre
onglets, et le back garde une rotation strictement à usage unique.

### Le déclencheur : statut, jamais code

`ha-core/ha-model/ha-config/ha-api-error.service.ts`

L'API utilise **deux codes** pour un `401` : `error.unauthorized` sur les routes protégées,
`error.wrong_token` seulement sur `/auth/refresh`. Un mécanisme branché sur le code serait
inerte, et ça ne se verrait qu'après 15 minutes d'usage réel.

Tout est donc piloté par le **statut**, avec deux exclusions : aucun utilisateur résolu
(rien à perdre — sinon boucle de rechargement infinie chez les visiteurs anonymes) et routes
`/auth/` (un mauvais mot de passe est un `401` aussi).

La question « y avait-il une session ? » est posée à `HaAuthenticatedUserService`, jamais à un
cookie. Le marqueur que lit le serveur est `httpOnly` : un `check()` côté navigateur répondrait
« non » indéfiniment et cette branche deviendrait du code mort le jour où l'API prend le marqueur
en charge. Le `clean()` qui suit désarme la branche, donc plusieurs `401` en vol ne demandent
qu'un seul rechargement.

Le spec ne fournit délibérément pas `FlCookieService` : toute régression qui rebrancherait la
décision sur un cookie échoue en `NullInjectorError`.

### La boucle OAuth / MCP corrigée

`ha-main/ha-login-page/ha-login-page.component.ts`

La page de login redirigeait vers `/oauth/authorize` sur la foi du marqueur. Token
expiré → l'API renvoyait sur `/login?returnUrl=…` → **boucle infinie**. Elle appelle
maintenant `refresh()` avant de rediriger.

### Le marqueur réduit au rendu serveur

Six endroits décidaient à partir du cookie côté navigateur. Plus aucun : ils s'appuient
maintenant sur `HaAuthenticatedUserService`, et le cookie ne sert plus qu'au rendu serveur.

| Endroit                           | Devenu                                                      |
| --------------------------------- | ----------------------------------------------------------- |
| chargement du profil au démarrage | appelle `/user`, sauf réponse SSR négative transmise        |
| `HaLoginGuard`, `HaStoryGuard`    | attendent `isAuthenticatedOnce()` ; cookie côté serveur     |
| `*haIsAuthenticated`              | suit `isAuthenticated()`, réagit donc aussi au login/logout |
| état du thème                     | s'appuie sur l'utilisateur résolu                           |
| page cli-auth                     | attend la réponse autoritative                              |

`HaAuthenticatedUserService` est l'autorité : `isAuthenticated()` reste silencieux tant que
la réponse est inconnue, pour qu'on ne confonde jamais « pas encore chargé » et « anonyme ».

### Le guard qui ne conclut pas

`ha-guard/ha-story.guard.ts`

`isStoryOwnerOrCoAuthor()` n'avait aucun `catchError` : pendant le SSR le token forwardé est expiré,
le `401` faisait **errer** l'observable du guard au lieu de renvoyer un `UrlTree`, et le rendu
échouait.

Un `401` sur cette vérification ne dit rien des droits du visiteur — c'est la réponse normale pour
une session valide 30 jours. Le guard laisse donc passer et **ne conclut pas** : le navigateur
rejoue le guard après hydratation, où la réponse est autoritative, et l'API garde la story de toute
façon, donc le serveur ne rend qu'une coquille vide. Tout autre échec est un vrai problème, pas un
identifiant manquant : retour au login.

### La charge anonyme

Le serveur lit le marqueur `httpOnly` et transmet sa réponse au navigateur
(`HA_SESSION_STATE_KEY`), consommée à la première lecture — sinon un `init()` après login
réutiliserait un « pas de session » périmé. Un visiteur anonyme ne déclenche donc aucun
appel.

Corollaire : les réponses SSR passent en `Cache-Control: no-store` (`server.ts`). Elles
portent un état par visiteur, et les règles existantes ne couvraient que les URLs finissant
par `.html` — ce qu'une route rendue n'est jamais.

### Couverture

**82 tests** répartis sur 9 fichiers, plus le lint. Les invariants les plus délicats — refresh
unique partagé, absence de boucle de rechargement, décision d'auth jamais reprise sur un cookie,
guard qui ne conclut pas sur un `401` — ont été vérifiés par mutation, en cassant volontairement le
code pour confirmer qu'un test l'attrape.

La mutation a d'ailleurs révélé un test creux : `expect(() => ...).not.toThrow()` sur un observable
ne prouve rien, rxjs remonte une erreur levée depuis un subscriber en asynchrone. Assertion sur une
trace explicite de l'erreur à la place.

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

Purement destructif — le lot qui a retiré le dernier gate cookie a été fait avant, exprès.

- [ ] supprimer l'écriture d'`Auth_Expiration` par le front (`HaAuthService.afterLogin`) et
      la constante `SESSION_MARKER_DURATION_MS`
- [ ] supprimer le `clearAuthExpirationCookie` de `HaAuthService.logout()` — c'est `/auth/logout`
      qui efface `Session_Active`, vérifié
- [ ] supprimer le repli sur `Auth_Expiration` dans
      `HaAuthenticatedUserService.hasSessionMarkerOnServer()`

Prérequis côté back **vérifiés dans le code**, il ne manque que le déploiement : marqueur en
`Path=/`, durée du refresh token, reposé à chaque rotation, effacé au logout.

Pas avant : le déploiement se fait **front d'abord, back ensuite**, et le front doit
fonctionner avec les deux versions du back.

### 3. Côté back (rappel)

- [ ] suite e2e écrite mais **jamais exécutée** — conteneur de base de test absent
      (`apps/hn-community-api/test/hn-auth.e2e.spec.ts`)
- [x] tokens MCP (`/oauth/*`) ramenés à 1 h, avec refresh et revoke — sans impact front

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

## Décisions prises

### Un `429` sur `/auth/refresh` déconnecte — assumé, à revoir si ça se voit

Aucun statut de refresh n'est traité à part : un refresh en `429` échoue, la requête d'origine est
rejouée, son `401` conclut la fin de session. L'utilisateur est donc déconnecté à tort si l'API
rate-limite son refresh.

Ce que ça coûte, mesuré côté back : `/auth/refresh` porte `@BlPublicSecure()` **sans options**, donc
il tombe sur le plafond global de `hn-app.module.ts` — **60 requêtes / minute par IP, partagé avec
toutes les routes publiques** — et non sur le `CREDENTIAL_THROTTLE` de 10/min de `/auth/login`. Un
`429` est donc plus atteignable qu'un quota dédié au refresh ne le suggérerait : derrière un NAT
d'entreprise, ce sont les autres routes publiques qui consomment le budget.

Assumé pour l'instant : le principe « aucun cas particulier » est ce qui rend le déploiement
front-avant-back sans risque. À revoir en priorité si des déconnexions inexpliquées remontent.

Si le cas se présente en production, le correctif n'est pas de sauter le rejeu — un refresh échoué
peut vouloir dire qu'un autre onglet a gagné la rotation, et le rejeu réussira. C'est de **retenir
le statut du refresh et, si le rejeu échoue aussi, remonter le `429` plutôt que le `401`** : le
rejeu multi-onglets est préservé et `HaApiErrorService` ne conclut rien.

### Le SSR rend une coquille anonyme aux connectés — assumé

Passé la durée du token d'accès, le `/user` du serveur reçoit un `Authorization` expiré, donc `401`,
donc un shell anonyme corrigé à l'hydratation. Les guards, eux, passent grâce au marqueur : aucune
redirection à tort, seulement un flicker.

C'est une régression réelle du passage à 15 minutes — avant, le token de 7 jours était presque
toujours valide pendant le SSR. Elle est assumée : le serveur ne peut structurellement pas
rafraîchir (`Refresh_Token` est en `Path=/auth`, il ne le reçoit jamais). Un rendu neutre plutôt
qu'anonyme quand le marqueur dit « peut-être connecté » supprimerait le flicker, si le confort le
justifie un jour.

---

## Points de vigilance pour la suite

- **Ne jamais rebrancher une décision d'authentification sur un cookie côté navigateur.**
  C'est le défaut de conception qu'on vient de retirer, y compris dans `HaApiErrorService`, le
  dernier endroit à s'y appuyer. Un cookie ne sait pas qu'un token expiré peut être renouvelé, ni
  qu'une session a été révoquée, et le marqueur de l'API sera `httpOnly` — donc illisible.
- **Ne jamais brancher quoi que ce soit sur `error.wrong_token` seul.** Deux codes existent,
  un troisième peut apparaître.
- **Le marqueur ne doit jamais raccourcir sous la durée du refresh token.** Trop long : un
  appel inutile qui se corrige. Trop court : une déconnexion à tort.
- **Le refresh ne doit pas passer par `FlApiService`.** Son pipeline d'erreur recharge la
  page sur un `401`, l'appelant ne verrait jamais l'échec.
