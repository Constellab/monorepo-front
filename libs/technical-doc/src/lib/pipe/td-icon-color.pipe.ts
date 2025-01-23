import { inject, Pipe, PipeTransform } from '@angular/core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TdTypeStyleIconColor } from '../model/td-type.class';

@Pipe({
    name: 'tdIconColor',
    standalone: false
})
export class TdIconColorPipe implements PipeTransform {
  private themeService = inject(FlThemeService);

  transform(color: TdTypeStyleIconColor): string {
    if (!color) return null;

    if (color === 'primaryContrast') return this.themeService.getCurrentThemeDetail().primaryContrast;
    else if (color === 'accentContrast') return this.themeService.getCurrentThemeDetail().accentContrast;
    else if (color === 'warnContrast') return this.themeService.getCurrentThemeDetail().warnContrast;

    return color;
  }
}
