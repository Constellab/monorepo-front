import { inject, Pipe, PipeTransform } from '@angular/core';
import { FlThemeService } from '@monorepo/front-core-lib';
import { TdTypeStyleBackgroundColor } from '../model/td-type.class';

@Pipe({
  name: 'tdIconBackgroundColor',
})
export class TdIconBackgroundColorPipe implements PipeTransform {
  private themeService = inject(FlThemeService);

  transform(color: TdTypeStyleBackgroundColor): string {
    if (!color) return null;

    if (color === 'primary') return this.themeService.getCurrentThemeDetail().primary;
    else if (color === 'accent') return this.themeService.getCurrentThemeDetail().accent;
    else if (color === 'warn') return this.themeService.getCurrentThemeDetail().warn;

    return color;
  }
}
