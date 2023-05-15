import {Injectable} from '@angular/core';
import {FlApiService, FlCleanableService, FlCleanerService, FlTranslateService} from '@monorepo/front-core-lib';
import {BehaviorSubject, Observable} from 'rxjs';
import {HaUser, HaUserCategory} from '../ha-model/ha-entities/ha-user';
import {HaAuthService} from './ha-auth.service';
import {map, tap} from 'rxjs/operators';
import {ClSupportedLanguage, ClTheme} from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root'
})
export class HaAuthenticatedUserService implements FlCleanableService{

  private readonly userRoute: string = 'user';
  private userAuthenticated: HaUser;
  public userSubject: BehaviorSubject<HaUser> = new BehaviorSubject<HaUser>(null);

  constructor(private apiService: FlApiService,
              private authService: HaAuthService,
              private translateService: FlTranslateService) {
    FlCleanerService.getInstance().registerService(this);
  }

  public init(): void {
    if (this.authService.hasAuthorizationCookie()) {
      this.apiService.get(this.userRoute).subscribe((user: HaUser) => {
        this.translateService.changeAppLanguage(user.lang);
        this.userAuthenticated = user;
        this.userSubject.next(user);
      });
    } else {
      this.userSubject.next(null);
    }
  }

  public getUser(): Observable<HaUser> {
    return this.userSubject.pipe();
  }

  public isAdmin(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => user != null && user.category === HaUserCategory.ADMIN)
    );
  }

  public changeTheme(theme: ClTheme): Observable<void> {
    return this.apiService.put(`${this.userRoute}/theme/${theme}`, null).pipe(
      tap(() => this.changeThemeSuccess(theme))
    );
  }

  public changeLang(lang: ClSupportedLanguage): Observable<void> {
    return this.apiService.put(`${this.userRoute}/lang/${lang}`, null).pipe(
      tap(() => this.changeLangSuccess(lang))
    );
  }

  private changeLangSuccess(lang: ClSupportedLanguage): void {
    this.userAuthenticated.lang = lang;
    this.translateService.changeAppLanguage(lang);
    this.notifyUserChange();
  }

  private changeThemeSuccess(theme: ClTheme): void {
    this.userAuthenticated.theme = theme;
    this.notifyUserChange();
  }

  private notifyUserChange(): void {
    // emit the new user
    this.userSubject.next(this.userAuthenticated);
  }

  clean(): void {
    this.userSubject.next(null);
  }


}
