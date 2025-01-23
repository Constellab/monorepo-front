import { Pipe, PipeTransform, inject } from '@angular/core';
import { FlThemeSwitch } from '../model/fl-theme-switch.class';
import { FlThemeService } from '../fl-theme.service';

/**
 * Pipe to switch between two values depending on the theme
 */
@Pipe({
  name: 'flThemeSwitch',
  standalone: false,
})
export class FlThemeSwitchPipe<T> implements PipeTransform {
  private themeService = inject(FlThemeService);

  transform(themeSwitch: FlThemeSwitch<T>): T {
    if (themeSwitch == null) return null;

    return this.themeService.isDarkTheme() ? themeSwitch.darkTheme : themeSwitch.lightTheme;
  }
}
