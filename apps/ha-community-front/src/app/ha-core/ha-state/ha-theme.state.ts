import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { ClTheme } from '@monorepo/core-lib';
import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';
import { Subject } from 'rxjs';

@Injectable()
export class HaThemeState {
  private themeService = inject(FlThemeService);
  private authUserService = inject(HaAuthenticatedUserService);

  private currentTheme: WritableSignal<ClTheme> = signal<ClTheme>(null);
  public isDarkTheme: Signal<boolean> = computed(() => {
    return this.currentTheme() === ClTheme.DARK_THEME;
  });
  public onThemeChange$: Subject<ClTheme> = new Subject<ClTheme>();

  public getCurrentTheme(): Signal<ClTheme> {
    return this.currentTheme;
  }

  init(): void {
    this.setTheme(this.themeService.getCurrentTheme());
    this.authUserService.getUser().subscribe((user) => {
      if (user != null && user.theme != this.currentTheme()) {
        this.setTheme(user.theme);
      }
    });
  }

  changeTheme(theme: ClTheme): void {
    this.setTheme(theme);
    if (this.authUserService.hasAuthorizationCookie()) {
      this.authUserService.changeTheme(theme).subscribe();
    }
  }

  destroy(): void {
    this.onThemeChange$.complete();
  }

  private setTheme(theme: ClTheme): void {
    this.currentTheme.set(theme);
    this.onThemeChange$.next(theme);
    this.themeService.changeTheme(theme);
  }
}
