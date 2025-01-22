import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  FlApiService,
  flAuthExpiredCookie,
  FlCleanableService,
  FlCleanerService,
  FlTranslateService,
  REQUEST,
} from '@monorepo/front-core-lib';
import { BehaviorSubject, Observable } from 'rxjs';
import { HaUser, HaUserCategory } from '../ha-model/ha-entities/ha-user';
import { HaAuthService } from './ha-auth.service';
import { map, tap } from 'rxjs/operators';
import { ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { HaBrick } from '../ha-model/ha-entities/ha-brick.class';
import { isPlatformServer } from '@angular/common';
import { Request } from 'express';

@Injectable({
  providedIn: 'root',
})
export class HaAuthenticatedUserService implements FlCleanableService {
  private apiService = inject(FlApiService);
  private authService = inject(HaAuthService);
  private translateService = inject(FlTranslateService);
  private platformId = inject(PLATFORM_ID);

  private readonly userRoute: string = 'user';
  private userAuthenticated: HaUser;
  public userSubject: BehaviorSubject<HaUser> = new BehaviorSubject<HaUser>(null);
  private request: Request;

  constructor() {
    const request = inject<Request>(REQUEST, { optional: true });

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

  private hasAuthCookie(): boolean {
    if (isPlatformServer(this.platformId)) {
      return this.request?.cookies[flAuthExpiredCookie] != null;
    }
    return this.authService.hasAuthorizationCookie();
  }

  public getUser(): Observable<HaUser> {
    return this.userSubject.pipe();
  }

  public isAdmin(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user != null && user.category === HaUserCategory.ADMIN));
  }

  public isBrickCreator(brick: HaBrick): Observable<boolean> {
    return this.getUser().pipe(map((user) => user != null && user.id == brick?.createdBy?.id));
  }

  public changeTheme(theme: ClTheme): Observable<void> {
    return this.apiService
      .put(`${this.userRoute}/theme/${theme}`, null)
      .pipe(tap(() => this.changeThemeSuccess(theme)));
  }

  public changeLang(lang: ClSupportedLanguage): Observable<void> {
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
