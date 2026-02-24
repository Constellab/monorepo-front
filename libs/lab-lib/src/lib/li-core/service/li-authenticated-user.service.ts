import { DestroyRef, inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlCleanableService, FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, Observable } from 'rxjs';

import { LiUser } from '../model/entities/li-user.entity';

/**
 * Service to handle the current authenticated user
 */
@Injectable({
  providedIn: 'root',
})
export class LiAuthenticatedUserService implements FlCleanableService {
  private apiService = inject(FlApiService);
  private translateService = inject(FlTranslateService);
  private themeService = inject(FlThemeService);

  private readonly usersRoute: string = 'user';

  // subject to subscribe to user changes
  private userSubject$: BehaviorSubject<LiUser> = new BehaviorSubject<LiUser>(null);

  constructor() {
    FlCleanerService.getInstance().registerService(this);
    inject(DestroyRef).onDestroy(() => {
      FlCleanerService.getInstance().unregisterService(this);
    });
  }

  /**
   * Call the get user information route and store the user in the service
   */
  public loadAuthenticatedUser(): void {
    this.apiService
      .get(this.usersRoute + '/me', LiUser)
      .subscribe((user) => this.storeUserAuthenticated(user));
  }

  private storeUserAuthenticated(user: LiUser): void {
    // check the user language
    this.translateService.changeAppLanguage(user.lang);

    // set the user theme
    this.themeService.changeTheme(user.theme);

    this.userSubject$.next(user);
  }

  public generateDevLoginUniqueCode(): Observable<string> {
    return this.apiService.get('dev-login-unique-code/generate');
  }

  clean(): void {
    this.userSubject$.next(null);
  }

  public getCurrentUser(): LiUser | null {
    return this.userSubject$.value;
  }

  public getUser$(): Observable<LiUser> {
    return this.userSubject$.asObservable();
  }
}
