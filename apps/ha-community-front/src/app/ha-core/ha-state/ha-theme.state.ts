import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ClTheme } from '@monorepo/core-lib';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { Subject } from 'rxjs';

import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';

/**
 * Manages theme (light/dark) state.
 *
 * Provided by HaMainComponent. Initializes to light theme on load.
 * When a logged-in user changes theme, it's persisted via the API (PUT /user/theme).
 * FlThemeService handles the actual CSS class toggle on <body>.
 */
@Injectable()
export class HaThemeState {
  private themeService = inject(FlThemeService);
  private authUserService = inject(HaAuthenticatedUserService);

  private currentTheme: WritableSignal<ClTheme | null> = signal<ClTheme | null>(null);
  public isDarkTheme: Signal<boolean> = computed(() => {
    return this.currentTheme() === ClTheme.DARK_THEME;
  });
  public onThemeChange$: Subject<ClTheme> = new Subject<ClTheme>();

  public getCurrentTheme(): Signal<ClTheme | null> {
    return this.currentTheme;
  }

  init(): void {
    this.setTheme(ClTheme.LIGHT_THEME);
  }

  changeTheme(theme: ClTheme): void {
    this.setTheme(theme);
    // only a resolved user has a theme to persist, a cookie says nothing about that
    if (this.authUserService.getCurrentUser() != null) {
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
