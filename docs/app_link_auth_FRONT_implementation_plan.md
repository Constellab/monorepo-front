# Front-end implementation plan — stable app links

Concrete build plan for `app_link_auth_FRONT.md`, scoped to this monorepo (`monorepo-front`).
Covers the **lab Angular SPA** (`lab-front` + shared libs) and the **space front** (`ca-space-front`).
The gws_core backend and space backend are out of scope (see the companion docs).

Decisions locked with the user:

- **A2 wiring:** login reads a `?redirect_uri` query param, validates it, and feeds it into the
  existing `FlLoginSavedRoute` store — reuse the current `loginCompleted()` redirect priority.
  No new input on `fl-login-page`.
- **A1 shape:** a full-page **Angular SPA route** (`/open/app/:appKey`) reusing the existing
  progress UI. The standalone-HTML alternative is not pursued.
- **A3/A4** (datalab entry points, shareable link) are noted at the end but not detailed here.

---

## Verified anchors in the current code

| What | Where |
| --- | --- |
| App-in-iframe + status polling + progress UI (the thing to reuse) | `libs/resource-view/src/lib/component/rv-view-app/rv-view-app.component.ts` (+ `.html`) |
| Progress states template (`fl-loader` + `status_text` + error) | `rv-view-app.component.html:3-16` |
| Status poll shape `{ status: RUNNING\|STOPPED\|STARTING, status_text? }` | `rv-view-app.component.ts:11-15,119-121` |
| Lab public/open routes (where `/open/app` slots in) | `apps/lab-front/src/app/lab-public-route/lab-public.routes.ts` |
| Open route wired under `LI_CONST_OPEN_ROUTE` | `apps/lab-front/src/app/lab-main/lab-main-routes.ts:137-140` |
| Existing public resource page (pattern to copy for interstitial) | `apps/lab-front/src/app/lab-public-route/lab-public-route-resource-page/lab-public-route-resource-page.component.ts` |
| Login page (lab wrapper) | `apps/lab-front/src/app/lab-login/component/lab-login-page/lab-login-page.component.ts` (+ `.html`) |
| Post-login redirect priority (SavedRoute > redirectionRoute) | `libs/front-core-lib/src/lib/fl-auth/component/fl-complete-login/fl-complete-login.component.ts:56-70` |
| SavedRoute store (path + queryParams parsing) | `libs/front-core-lib/src/lib/fl-core/utils/fl-login-saved-route.ts` |
| Space app-in-iframe (the thing to stop iframing) | `apps/ca-space-front/src/app/ca-folder/module/ca-resource-core/ca-resource-detail/ca-resource-detail.component.ts:61-69` + `.html:41` |
| Space resource model (`accessUrl`, `isApplication`) | `apps/ca-space-front/src/app/ca-core/model/entities/folder/ca-resource.class.ts` |

Note: today's polling lives **inside** `RvViewApp` and refreshes every **5s**; the interstitial
should poll ~**1s** per the doc. So the interstitial is a *sibling* that reuses the progress
*template*, not the `RvViewApp` component wholesale.

---

## A1 — Interstitial "starting…" page (`/open/app/:appKey`)

**Goal:** a standalone, bookmarkable full-page route that polls process status, shows the existing
progress UI, and on `RUNNING` navigates (full-page) to the backend `ready` endpoint.

### A1.1 — Extract the progress UI so both places share it

The three status states (`RUNNING` iframe / `STARTING` loader+text / else error+text) live only in
`rv-view-app.component.html`. Pull the **STARTING / error** presentation into a tiny reusable dumb
component so the interstitial and the resource panel render identically.

- New component: `libs/resource-view/src/lib/component/rv-app-progress/rv-app-progress.component.{ts,html,scss}`
  - Inputs (signals): `status: 'RUNNING'|'STOPPED'|'STARTING'`, `statusText?: string`.
  - Renders the `STARTING` (`fl-loader` + `statusText`) and error branches verbatim from
    `rv-view-app.component.html:3-16`. It does **not** render the iframe (that stays in `RvViewApp`).
  - Reuses the existing `rvResourceView.error_app_starting` translation key.
- Refactor `rv-view-app.component.html` to use `<rv-app-progress [status] [statusText]>` for the
  non-RUNNING branches. Behaviour unchanged (pure extraction).
- Export it from the `resource-view` public API so `lab-front` can import it.

> If cross-lib export friction is high, the fallback is to inline the same 6 lines of template in the
> interstitial (it's trivial markup). Prefer the shared component.

### A1.2 — Interstitial component + route

- New component folder: `apps/lab-front/src/app/lab-public-route/lab-open-app-page/lab-open-app-page.component.{ts,html,scss}`.
  Standalone, modern Angular (signals, `inject()`), following `lab-public-route-resource-page` as the
  structural template.
- **Bootstrap inputs** (from the backend redirect / page bootstrap per the doc): read from
  `ActivatedRoute` — `appKey` (path param) and the **process token** to watch (query param, e.g.
  `?token=` — confirm the exact name the gws_core gateway emits; the doc calls it "the process/token
  to watch"). Keep the source of the token in one clearly-commented spot so a backend rename is a
  one-line change.
- **State (signals):** `status`, `statusText`, plus a `hasError` computed.
- **Polling:** ~1s interval, `switchMap` → `GET {core-api}/apps/process/{token}/status`,
  `takeWhile(status === 'STARTING', true)` (same operator pattern as `RvViewApp`, faster interval).
  Reuse the `RvAppProcessStatus` interface (or its lab-lib equivalent). Use the existing lab HTTP
  service rather than raw `HttpClient` if one already wraps the core-api base URL.
- **Render:** `<rv-app-progress [status] [statusText]>` for STARTING/error, plus a **Retry** button in
  the error branch.
- **On `RUNNING`:** full-page navigation (`window.location.assign(...)`, *not* Angular router — the
  target is a backend 302, not an SPA route) to `GET /open/app/{appKey}/ready`. Do **not** build the
  app URL in the front.
- **On `STOPPED` / error:** show `statusText` + **Retry** button that re-hits `/open/app/{appKey}`
  (again `window.location`, since that's a backend route).
- **Standalone-safe:** the component must not depend on the authenticated app shell or prior in-app
  state (it lives under the public `open` routes, exactly like the resource page). Verify it renders
  with no `LI_CONST_BASE_ROUTE` context loaded.

### A1.3 — Register the route

In `apps/lab-front/src/app/lab-public-route/lab-public.routes.ts`, add under the existing children:

```ts
{
  path: 'app/:appKey',
  loadComponent: () =>
    import('./lab-open-app-page/lab-open-app-page.component').then((m) => m.LabOpenAppPageComponent),
},
```

This yields `/open/app/:appKey` because `LAB_OPEN_ROUTES` is mounted at `LI_CONST_OPEN_ROUTE`
(`lab-main-routes.ts:138`). Confirm `LI_CONST_OPEN_ROUTE === 'open'`.

> The `.../ready` endpoint is a **backend** route (gws_core) — the front never registers it; it only
> navigates the browser to it.

### A1.4 — i18n

Add EN + FR keys for the Retry button (e.g. `lab.open_app.retry`) in `lab-global-{en,fr}.json`.
The status strings themselves come from the backend `status_text` (rendered verbatim) — no new keys.

---

## A2 — Login honors `redirect_uri` (query param → SavedRoute)

**Goal:** when the gateway sends an unidentified user to `/login?redirect_uri=/open/app/...`, the
login page returns there after success — reusing the existing `FlLoginSavedRoute` redirect path.

### A2.1 — Read + validate the param in the lab login page

In `LabLoginPageComponent` (`lab-login-page.component.ts`):

- `inject(ActivatedRoute)`, read `queryParams['redirect_uri']` on init.
- **Open-redirect guard (front side):** accept the value only if it is a **same-origin**,
  **path-only** URL beginning with `/open/app/` (reject absolute URLs, other-origin, `//`,
  backslashes, and anything not matching `^/open/app/`). On rejection, ignore it (fall through to the
  default `appRoute`). The backend enforces this too — belt and suspenders per the doc.
- If valid, `FlLoginSavedRoute.setRoute(redirect_uri)` **before** the user submits credentials, so the
  existing `loginCompleted()` logic (`fl-complete-login.component.ts:62-66`) picks it up.
  - `FlLoginSavedRoute` currently exposes `route` (public static) + `hasRoute/getRoutePath/
    getRouteQueryParams/clearRoute` but **no setter**. Add a small `setRoute(route: string)` static to
    `fl-login-saved-route.ts` rather than assigning the public field directly (keeps intent clear and
    matches the getter API).

### A2.2 — Nothing changes in `fl-complete-login`

The priority `SavedRoute > redirectionRoute` already exists (`:62-70`). Because we populate SavedRoute,
the existing navigation handles the redirect. `redirectionRoute` (`appRoute` = `/app`) remains the
fallback when no `redirect_uri` was supplied. **No change to the shared component.**

### A2.3 — Edge cases to cover

- `redirect_uri` present **and** a session-expired SavedRoute already set: last writer wins; document
  that `redirect_uri` is only set when actually present on the URL, so it won't clobber an
  expiry-saved route unless the user explicitly arrived via `?redirect_uri=`.
- 2FA path: the flow already round-trips through `twoFAUrlCode` query param and ends in the same
  `loginCompleted()` — SavedRoute survives because it's a static (not query-param) store. Verify.
- SavedRoute is cleared after use (`clearRoute()` at `:66`) — no stale carry-over.

---

## B1 — Space front: navigate instead of iframe

**Goal:** stop nesting the app in an iframe; navigate top-level to the `accessUrl` (which, after the
space-backend change, is a lab gateway URL that runs auth/cold-start/handoff itself).

Current: `ca-resource-detail.component.ts:61-69` binds `resource.accessUrl` into an iframe
(`ca-resource-detail.component.html:41`). The fetch is already **fresh per open** (no cache) — keep it.

### B1.1 — Branch on app-ness

`CaResource` already exposes `isApplication`. For an **application** resource, replace the iframe with a
top-level navigation to `accessUrl`; for **non-app** resources, keep the current iframe (their
`accessUrl` is still a resource-open page, unchanged by this work).

- In `resource$`'s `tap`, when `resource.isApplication`:
  - Do **not** set the sanitized iframe `url`.
  - Instead trigger a top-level open. Recommended: **open in a new tab** (`window.open(accessUrl,
    '_blank')`) so the user keeps the space context — matches the recent product direction (see the
    reverted "open app in a new tab" commits; confirm the desired tab-vs-same-window behaviour with
    the team before finalizing). Alternative: same-window `window.location.assign(accessUrl)`.
  - Guard against double-open on re-emits of `resource$` (e.g. only open once per distinct
    `resourceId`/`accessUrl`).
- Template (`ca-resource-detail.component.html:41`): render the iframe only for non-app resources
  (`@if (!resource.isApplication)`), and for apps render the **B2** loading affordance instead.

### B1.2 — Fresh URL per open (do-not-regress)

The plan already fetches fresh (`switchMap`, no `shareReplay`). Add a comment noting the gateway code
in `accessUrl` is **single-use** — never cache or reuse a previous `accessUrl`. No code change needed;
just guard the refactor from accidentally introducing caching.

### B2 — Loading affordance (optional, recommended small)

Since the gateway shows its own "starting…" page after navigation, the space only needs a brief
"Opening app…" state for the app branch (while `resource$` resolves and the new tab/redirect fires).

- Add an "Opening app…" placeholder (an `fl-loader` + text) in the app branch of the template.
- New i18n keys EN/FR (space i18n) e.g. `ca.resource.opening_app`.

### B3 — Iframe fallback during rollout (optional, skip by default)

The gateway URL also works *inside* an iframe. If a staged rollout is wanted, keep iframing apps first
and flip to navigation later. Default: ship B1 (navigation) directly, since the iframe-blocked client
only benefits once navigation lands. Not planning B3 unless requested.

> **Cross-repo dependency:** B1 is only *useful* once the space backend returns a **gateway** URL for
> app share links (SPACE_BACK / gws_core step 5a). Until then `accessUrl` is still a resource-open URL
> and navigating to it top-level works but doesn't yet give the iframe-free gateway benefit.
> Coordinate the release. The change is safe to ship earlier because navigating to any `accessUrl`
> top-level is still a valid open.

---

## A3 / A4 — datalab entry points (out of detailed scope, noted)

Independent niceties, shippable anytime after the gateway exists:

- **A3:** add an "Open app (new tab)" action on the app-resource page that navigates to
  `/open/app/{appKey}`.
- **A4:** surface a copyable "shareable link" (`/open/app/{appKey}`) on the app-resource page.

Both are small and depend only on the `/open/app` route (A1) existing. Detail on request.

---

## Build order & dependencies

1. **A1.1** (extract `rv-app-progress`) — pure refactor, ship first, unblocks A1.2.
2. **A1.2–A1.4** (interstitial route) — core lab deliverable; lands with gws_core step 3.
3. **A2** (login `redirect_uri`) — small, independent of A1; required for external/space opens to
   complete the auth hop. Can land in parallel with A1.
4. **B1/B2** (space navigation) — depends on the space backend returning a gateway URL; coordinate
   that release. Safe to ship after the backend flip.
5. **A3/A4** — anytime after A1.

Confirm before coding: the exact **query-param name** the gateway uses to hand the process token to
the interstitial (A1.2), and the desired **new-tab vs same-window** behaviour for B1.

## Testing

- **A1:** unit test the interstitial — STARTING keeps polling, RUNNING triggers navigation to
  `.../ready`, STOPPED shows Retry, poll interval ~1s, standalone render with no app shell.
- **A1.1:** `rv-view-app` still renders all three states after the extraction (regression).
- **A2:** valid `/open/app/...` `redirect_uri` → SavedRoute set → post-login navigates there; malicious
  values (absolute URL, other-origin, `//evil`, non-`/open/app`) rejected → falls back to `/app`; 2FA
  path preserves the redirect.
- **B1:** app resource → top-level navigation fired, no iframe; non-app resource → iframe unchanged;
  fresh `accessUrl` fetched per open (no cache).

Per project rules: do **not** run full app builds or lint to verify; rely on `nx test <project>` for
the touched projects (`resource-view`, `lab-front`, `ca-space-front`).
