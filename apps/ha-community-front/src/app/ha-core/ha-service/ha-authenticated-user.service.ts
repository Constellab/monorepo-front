import { isPlatformServer } from '@angular/common';
import {
  DestroyRef,
  inject,
  Injectable,
  Injector,
  makeStateKey,
  PLATFORM_ID,
  REQUEST,
  StateKey,
  TransferState,
} from '@angular/core';
import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FL_AUTH_EXPIRED_COOKIE,
  FlCleanableService,
  FlCleanerService,
} from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import { HaBrick } from '../ha-model/ha-entities/ha-brick.class';
import { HaUser, HaUserCategory } from '../ha-model/ha-entities/ha-user';
import { HA_AUTHORIZATION_COOKIE, HA_SESSION_MARKER_COOKIE, HaAuthService } from './ha-auth.service';
import { HaAuthSessionService } from './ha-auth-session.service';

/** Whether the SSR server saw a session marker cookie, handed over to the browser. */
export const HA_SESSION_STATE_KEY: StateKey<boolean> = makeStateKey<boolean>('haHasSession');

/**
 * Manages the currently authenticated user state, and is the authority on who is logged in.
 *
 * The answer comes from /user and from nothing else. A marker cookie may only decide that the call
 * is not worth making, for a visitor who certainly has no session; it never decides that a visitor
 * is anonymous, and neither does a failed refresh. Both would leave a logged in user looking
 * signed out while their requests keep working, which is the failure this service exists to avoid.
 *
 * Initialized at app startup via provideAppInitializer (see ha-app.config.ts). Fetches the user
 * from the API and pushes it to userSubject. Other components/services observe getUser() to react
 * to auth state changes.
 *
 * SSR-aware: on the server, reads cookies from the Express request object to determine auth state
 * without browser APIs.
 *
 * Implements FlCleanableService so FlCleanerService can reset it on logout.
 */
@Injectable({
  providedIn: 'root',
})
export class HaAuthenticatedUserService implements FlCleanableService {
  private apiService = inject(FlApiService);
  private translateService = inject(FlTranslateService);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);
  private snackBarService = inject(FlSnackBarService);
  private transferState = inject(TransferState);
  private sessionService = inject(HaAuthSessionService);
  private authService = inject(HaAuthService);
  private readonly userRoute: string = 'user';
  private userAuthenticated: HaUser;
  public userSubject: BehaviorSubject<HaUser | undefined> = new BehaviorSubject<HaUser | undefined>(
    undefined
  );
  private request: any;

  constructor() {
    const request = this.injector.get(REQUEST, null, { optional: true });
    const destroyRef = inject(DestroyRef);

    FlCleanerService.getInstance().registerService(this);
    destroyRef.onDestroy(() => {
      FlCleanerService.getInstance().unregisterService(this);
    });
    if (isPlatformServer(this.platformId)) {
      this.request = request;
    }
  }

  /**
   * Resolve who the visitor is, at startup and again after a login.
   *
   * At startup the app has lost everything a reload cannot carry: it knows neither whether it is
   * logged in nor when its access token dies, the cookies being httpOnly. The pair is therefore
   * renewed first, once, which hands over the expiresIn that arms the proactive renewal and lets
   * the /user call leave with a fresh token instead of a 401 to recover from.
   *
   * That renewal is best effort and decides nothing. /user runs whatever it answered, and its
   * answer is the only one that counts: a failed refresh may just mean another tab won the
   * rotation, while the access token in the jar is perfectly valid.
   */
  public init(): void {
    if (!this.mayHaveSession()) {
      this.userSubject.next(null);
      return;
    }

    if (this.sessionService.shouldResume()) {
      this.sessionService.resume().subscribe(() => this.loadUser());
      return;
    }

    this.loadUser();
  }

  private loadUser(): void {
    this.apiService.get(this.userRoute).subscribe({
      next: (user: HaUser) => {
        this.translateService.changeAppLanguage(user.lang);
        this.userAuthenticated = user;
        this.userSubject.next(user);
      },
      error: () => {
        this.userSubject.next(null);
      },
    });
  }

  /**
   * Whether a session may exist. The only question a marker is ever allowed to answer, and it may
   * only spare a pointless call: a false here means "no call at all", never "this user is
   * anonymous" - that answer belongs to /user.
   *
   * Every available signal is OR'ed, because being wrong in the "no" direction leaves a logged in
   * user looking anonymous for the whole life of the page, while being wrong in the "maybe"
   * direction costs one request. In particular the browser does not take the renderer's word for
   * it: a render only sees the cookies the browser sends it, and the API sets its own on its own
   * domain, so a negative may simply mean the renderer was never shown them.
   */
  private mayHaveSession(): boolean {
    if (isPlatformServer(this.platformId)) {
      const hasSession: boolean = this.hasSessionMarkerOnServer();
      this.transferState.set(HA_SESSION_STATE_KEY, hasSession);
      return hasSession;
    }

    const transferred: boolean = this.transferState.get(HA_SESSION_STATE_KEY, true);
    // consume it: init() runs again after a login, where a stale "no session" would be wrong
    this.transferState.remove(HA_SESSION_STATE_KEY);
    return transferred || this.authService.mayHaveSession();
  }

  /**
   * Authoritative authentication state. Stays silent while the answer is unknown, so callers never
   * mistake "not loaded yet" for "anonymous".
   */
  public isAuthenticated(): Observable<boolean> {
    return this.userSubject.pipe(
      filter((user) => user !== undefined),
      map((user) => user != null)
    );
  }

  /**
   * Same answer, resolved once. For guards and one shot decisions.
   */
  public isAuthenticatedOnce(): Observable<boolean> {
    return this.isAuthenticated().pipe(take(1));
  }

  /**
   * Last known user, null when anonymous or not resolved yet. Only for callers that cannot wait.
   */
  public getCurrentUser(): HaUser {
    return this.userSubject.value ?? null;
  }

  /**
   * SSR only: the markers carried by the Express request. On the browser, ask the API instead -
   * see isAuthenticated().
   *
   * The server cannot renew an expired access token, it could not plumb the new cookies back to
   * the browser, so a marker is its only signal that a session exists. Without one every server
   * rendered page would come out logged out for a user whose session is valid for 30 days.
   *
   * The three are read, and any of them is enough, because each can be missing for a reason that
   * has nothing to do with the session:
   * - Session_Active and Authorization are set by the API on its own domain, so a render served
   *   from another one never receives them;
   * - Auth_Expiration is written by the front on the front origin, so it is always received here,
   *   but it is missing for a session opened before it existed.
   */
  public hasSessionMarkerOnServer(): boolean {
    const cookies: Record<string, string> = this.request?.cookies;
    return (
      cookies?.[HA_SESSION_MARKER_COOKIE] != null ||
      cookies?.[HA_AUTHORIZATION_COOKIE] != null ||
      cookies?.[FL_AUTH_EXPIRED_COOKIE] != null
    );
  }

  public getUser(): Observable<HaUser> {
    return this.userSubject.pipe();
  }

  public isAdmin(): Observable<boolean> {
    return this.getUser().pipe(
      map((user) => {
        return user != null && user.category === HaUserCategory.ADMIN;
      })
    );
  }

  public isBrickCreator(brick: HaBrick): Observable<boolean> {
    return this.getUser().pipe(map((user) => user != null && user.id == brick?.createdBy?.id));
  }

  public changeTheme(theme: ClTheme): Observable<void> {
    return this.apiService
      .put(`${this.userRoute}/theme/${theme}`, null)
      .pipe(tap(() => this.changeThemeSuccess(theme)));
  }

  public changeLang(lang: ClSupportedLanguage): ClSupportedLanguage {
    if (this.getCurrentUser() != null) {
      this.changeUserLang(lang).subscribe(() => {
        this.snackBarService.openSuccessMessage({
          text: 'language_changed',
          translateText: true,
          translateParam: {
            param: {
              lang: lang == ClSupportedLanguage.fr ? 'Français' : 'English',
            },
          },
        });
      });
    } else {
      this.translateService.changeAppLanguage(lang);
      this.snackBarService.openSuccessMessage({
        text: 'language_changed',
        translateText: true,
        translateParam: {
          param: {
            lang: lang == ClSupportedLanguage.fr ? 'Français' : 'English',
          },
        },
      });
    }
    return lang;
  }

  private changeUserLang(lang: ClSupportedLanguage): Observable<void> {
    return this.apiService
      .put(`${this.userRoute}/lang/${lang}`, null)
      .pipe(tap(() => this.changeLangSuccess(lang)));
  }

  private changeLangSuccess(lang: ClSupportedLanguage): void {
    this.userAuthenticated.lang = lang;
    this.translateService.changeAppLanguage(lang);
    this.notifyUserChange();
  }

  private changeThemeSuccess(theme: ClTheme): void {
    this.userAuthenticated.theme = theme;
  }

  private notifyUserChange(): void {
    // emit the new user
    this.userSubject.next(this.userAuthenticated);
  }

  clean(): void {
    this.userSubject.next(null);
  }
}
