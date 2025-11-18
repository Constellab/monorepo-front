import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, Injectable, Injector, PLATFORM_ID, REQUEST } from '@angular/core';
import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { flAuthExpiredCookie, FlCleanableService, FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { HaBrick } from '../ha-model/ha-entities/ha-brick.class';
import { HaUser, HaUserCategory } from '../ha-model/ha-entities/ha-user';
import { HaAuthService } from './ha-auth.service';

@Injectable({
  providedIn: 'root',
})
export class HaAuthenticatedUserService implements FlCleanableService {
  private apiService = inject(FlApiService);
  private authService = inject(HaAuthService);
  private translateService = inject(FlTranslateService);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);
  private snackBarService = inject(FlSnackBarService);
  private readonly userRoute: string = 'user';
  private userAuthenticated: HaUser;
  public userSubject: BehaviorSubject<HaUser> = new BehaviorSubject<HaUser>(null);
  private request: any;

  constructor() {
    const request = this.injector.get(REQUEST, null, { optional: true });

    FlCleanerService.getInstance().registerService(this);
    if (isPlatformServer(this.platformId)) {
      this.request = request;
    }
  }

  public init(): void {
    if (this.hasAuthCookie()) {
      this.apiService.get(this.userRoute).subscribe((user: HaUser) => {
        this.translateService.changeAppLanguage(user.lang);
        this.userAuthenticated = user;
        this.userSubject.next(user);
      });
    } else {
      this.userSubject.next(null);
    }
  }

  public hasAuthorizationCookie(): boolean {
    return this.hasAuthCookie();
  }

  private hasAuthCookie(): boolean {
    if (isPlatformBrowser(this.platformId)) return this.authService.hasAuthorizationCookie();

    if (this.request?.cookies) return this.request?.cookies[flAuthExpiredCookie] != null;

    return false;
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
    if (this.hasAuthCookie()) {
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
