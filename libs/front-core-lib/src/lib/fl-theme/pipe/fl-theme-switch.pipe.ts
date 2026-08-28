import { inject, Pipe, PipeTransform } from '@angular/core';

import { FlThemeService } from '../fl-theme.service';
import { FlThemeSwitch } from '../model/fl-theme-switch.class';

/**
 * Pipe to switch between two values depending on the theme
 */
@Pipe({
  name: 'flThemeSwitch',
  standalone: false,
})
export class FlThemeSwitchPipe<T> implements PipeTransform {
  private themeService = inject(FlThemeService);

  transform(themeSwitch: FlThemeSwitch<T>): T | null {
    if (themeSwitch == null) return null;

    return this.themeService.isDarkTheme() ? themeSwitch.darkTheme : themeSwitch.lightTheme;
  }
}
