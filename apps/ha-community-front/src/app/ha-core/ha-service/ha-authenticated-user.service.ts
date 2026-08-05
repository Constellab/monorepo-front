import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DestroyRef, inject, Injectable, Injector, PLATFORM_ID, REQUEST } from '@angular/core';
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

/**
 * Manages the currently authenticated user state.
 *
 * Initialized at app startup via provideAppInitializer (see ha-app.config.ts).
 * If an auth cookie exists, fetches the user from the API and pushes it to userSubject.
 * Other components/services observe getUser() to react to auth state changes.
 *
 * SSR-aware: on the server, reads cookies from the Express request object
 * to determine auth state without browser APIs.
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

  public init(): void {
    if (!this.shouldLoadUser()) {
      this.userSubject.next(null);
      return;
    }

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
   * On the browser the API is the authority and the call is always worth making: an expired access
   * token is renewed by HaHttpRefreshInterceptorService and the request replayed, so a cookie must
   * never decide whether to ask.
   *
   * The server has no such recourse. It cannot plumb renewed cookies back to the browser, so once
   * the 15 min access token has expired the marker cookie is its only signal that a session
   * exists. Without it every server rendered page would come out logged out for a user whose
   * session is valid for 30 days.
   */
  private shouldLoadUser(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return true;
    }
    return this.request?.cookies?.[FL_AUTH_EXPIRED_COOKIE] != null;
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
   * SSR only: the marker cookie carried by the Express request. On the browser, ask the API
   * instead - see isAuthenticated().
   */
  public hasSessionMarkerOnServer(): boolean {
    return this.request?.cookies?.[FL_AUTH_EXPIRED_COOKIE] != null;
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
