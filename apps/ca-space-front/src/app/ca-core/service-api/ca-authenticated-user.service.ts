import { Location } from '@angular/common';
import { DestroyRef, DOCUMENT, inject, Injectable } from '@angular/core';
import { ClSupportedLanguage, ClTheme, ClUserCategory } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlCleanableService, FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CaUser } from '../model/entities/ca-user.class';
import { CaSpaceInfoDto } from '../model/entities/space/ca-space.class';
import { CaEnvironmentHelper } from '../utils/ca-environment.helper';
import { CaCurrentSpaceService } from './ca-current-space.service';
import { CaSpaceService } from './ca-space.service';

/**
 * Service to handle the current authenticated user
 */
@Injectable({
  providedIn: 'root',
})
export class CaAuthenticatedUserService implements FlCleanableService {
  private apiService = inject(FlApiService);
  private translateService = inject(FlTranslateService);
  private themeService = inject(FlThemeService);
  private spaceService = inject(CaSpaceService);
  private currentSpaceService = inject(CaCurrentSpaceService);
  location = inject(Location);
  private document = inject<Document>(DOCUMENT);

  private readonly currentUserRoute: string = 'users/current';

  private userAuthenticated: CaUser | null = null;
  // subject to subscribe to user changes
  private userSubject: BehaviorSubject<CaUser | null> = new BehaviorSubject<CaUser | null>(null);

  constructor() {
    FlCleanerService.getInstance().registerService(this);
    inject(DestroyRef).onDestroy(() => {
      FlCleanerService.getInstance().unregisterService(this);
    });
  }

  /**
   * Call the get user information route and store the user in the service
   */
  public loadCurrentInfo(): Observable<CaSpaceInfoDto> {
    this.currentSpaceService.init();
    return this.spaceService
      .getCurrentInfo()
      .pipe(map((spaceInfo) => this.storeCurrentAuthenticatedInfo(spaceInfo)));
  }

  /**
   * Whether a session really exists, answered by the API.
   *
   * For the places that have to know before the app has loaded a user - the login page and the
   * invitation page. They used to read the 'Auth_Expiration' marker instead, which was self
   * correcting only while it expired with the token. It now outlives the session by design, so a
   * marker left behind by a session that ended weeks ago would send its owner into the app just to
   * be thrown out again. A marker may only ever spare a pointless call; it never answers this.
   */
  public hasLiveSession(): Observable<boolean> {
    return this.loadCurrentInfo().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public getCurrentUser(): CaUser {
    if (this.userAuthenticated == null) {
      throw new Error('The user is not loaded yet');
    }
    return this.userAuthenticated;
  }

  public getUser$(): Observable<CaUser | null> {
    return this.userSubject.asObservable();
  }

  private storeCurrentAuthenticatedInfo(spaceInfo: CaSpaceInfoDto): CaSpaceInfoDto {
    if (CaEnvironmentHelper.isProduction() && this.document.defaultView != null) {
      // if the website space domain does not correspond to the user space domain
      // redirect to the website space domain
      const defaultView = this.document.defaultView;
      const hostname = defaultView.location.hostname;
      const domains = hostname.split('.');

      const spaceInfoUrl = `https://${spaceInfo.space.domain}.${CaEnvironmentHelper.getFrontDomain()}`;
      // if there is no subdomain, redirect to user space domain with the full route
      if (domains.length === 2) {
        // redirect to the space domain, keep the route.
        defaultView.location.href = `${spaceInfoUrl}${this.location.path(true)}`;
        // throw an error so the guard does not navigate to the page
        throw new Error('Redirect to the space domain');
      } else {
        // if the user is in a space domain that he can't access,
        if (domains[0] !== spaceInfo.space.domain) {
          // redirect to the space domain dashboard (remove the route) so he does not ends up
          // in an object not accessible in the new space
          defaultView.location.href = `${spaceInfoUrl}`;
          // throw an error so the guard does not navigate to the page
          throw new Error('Redirect to the space domain');
        }
      }
    }

    this.currentSpaceService.setCurrentSpace(spaceInfo.space);
    this.currentSpaceService.setCurrentSpaceUserRole(spaceInfo.roleInSpace);
    this.storeUserAuthenticated(spaceInfo.user);
    return spaceInfo;
  }

  private storeUserAuthenticated(user: CaUser): CaUser {
    // check the user language
    this.translateService.changeAppLanguage(user.lang);

    // set the user theme
    this.themeService.changeTheme(user.theme);

    this.userAuthenticated = user;
    this.notifyUserChange();

    return this.userAuthenticated;
  }

  private notifyUserChange(): void {
    // emit the new user
    this.userSubject.next(this.userAuthenticated);
  }

  /////////////////////////////// METHOD ON AUTHENTICATED USER //////////////////////////

  public changeLanguage(lang: ClSupportedLanguage): Observable<void> {
    return this.apiService
      .put(`${this.currentUserRoute}/language/${lang}`, null)
      .pipe(tap(() => this.changeLanguageSuccess(lang)));
  }

  private changeLanguageSuccess(lang: ClSupportedLanguage): void {
    this.translateService.changeAppLanguage(lang);
    if (this.userAuthenticated) {
      this.userAuthenticated.lang = lang;
      this.notifyUserChange();
    }
  }

  public changeTheme(theme: ClTheme): Observable<void> {
    return this.apiService
      .put(`${this.currentUserRoute}/theme/${theme}`, null)
      .pipe(tap(() => this.changeThemeSuccess(theme)));
  }

  private changeThemeSuccess(theme: ClTheme): void {
    if (this.userAuthenticated) {
      this.userAuthenticated.theme = theme;
      this.notifyUserChange();
    }
  }

  public uploadPhoto(file: File): Observable<CaUser> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.apiService.put(this.currentUserRoute + '/photo', formData, CaUser).pipe(
      tap((user) => {
        this.userAuthenticated = user;
        this.notifyUserChange();
      })
    );
  }

  public deletePhoto(): Observable<CaUser> {
    return this.apiService.delete(this.currentUserRoute + '/photo', CaUser).pipe(
      tap((user) => {
        this.userAuthenticated = user;
        this.notifyUserChange();
      })
    );
  }

  public editUser(newUserInfo: Partial<CaUser>): Observable<CaUser> {
    return this.apiService.put(this.currentUserRoute + '/edit', newUserInfo, CaUser).pipe(
      tap((user) => {
        this.userAuthenticated = user;
        this.notifyUserChange();
      })
    );
  }

  public has2FA(): Observable<boolean> {
    return this.apiService.get(`${this.currentUserRoute}/2-fa`).pipe(map((response) => response.enabled));
  }

  public set2FA(enabled: boolean): Observable<boolean> {
    return this.apiService
      .put(`${this.currentUserRoute}/2-fa`, { enabled })
      .pipe(map((response) => response.enabled));
  }

  /////////////////////////////// OTHER //////////////////////////
  public isAdmin(): boolean {
    return this.userAuthenticated?.isAdmin() ?? false;
  }

  /**
   * return true is the authenticated user is an admin of the current space or
   * a G admin
   */
  public isCurrentSpaceAdmin(): boolean {
    return this.isAdmin() || this.currentSpaceService.isSpaceAdmin();
  }

  /**
   * return true if the authenticated user is at least a user (not a viewer) of the current space
   * or a G admin
   */
  public isCurrentSpaceUser(): boolean {
    return (
      this.isAdmin() || this.currentSpaceService.isSpaceAdmin() || this.currentSpaceService.isSpaceUser()
    );
  }

  public isCategory(...categories: ClUserCategory[]): boolean {
    return this.userAuthenticated?.isCategory(...categories) ?? false;
  }

  public hasEntrepriseLicense(): boolean {
    return this.userAuthenticated?.hasEntrepriseLicense() ?? false;
  }

  clean(): void {
    this.userAuthenticated = null;
    this.userSubject.next(null);
  }
}
