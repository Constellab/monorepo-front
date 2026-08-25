import { inject, Pipe, PipeTransform } from '@angular/core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { TdTypeStyle } from '../model/td-type.class';

/**
 * Pipe to get the text color based on type style (based on background color or theme contrast color)
 */
@Pipe({
  name: 'tdIconAutoColor',
  standalone: false,
})
export class TdIconAutoColorPipe implements PipeTransform {
  private themeService = inject(FlThemeService);

  transform(style: TdTypeStyle): string | null | undefined {
    if (!style) return null;

    if (style.icon_color === 'primaryContrast')
      return this.themeService.getCurrentThemeDetail().primaryContrast;
    else if (style.icon_color === 'accentContrast')
      return this.themeService.getCurrentThemeDetail().accentContrast;
    else if (style.icon_color === 'warnContrast')
      return this.themeService.getCurrentThemeDetail().warnContrast;

    if (style.background_color) {
      // generate a darker color based on background color
      return TdIconAutoColorPipe.getIconColorFromBackgroundColor(style.background_color);
    }

    return style.icon_color;
  }

  public static getIconColorFromBackgroundColor(backgroundColor: string): string {
    // generate a darker color based on background color
    return `color-mix(in srgb, ${backgroundColor} 30%, black)`;
  }
}
