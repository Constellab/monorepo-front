import { inject, Pipe, PipeTransform } from '@angular/core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { TdTypeStyleBackgroundColor } from '../model/td-type.class';

@Pipe({
  name: 'tdIconBackgroundColor',
  standalone: false,
})
export class TdIconBackgroundColorPipe implements PipeTransform {
  private themeService = inject(FlThemeService);

  transform(color: TdTypeStyleBackgroundColor): string | null {
    if (!color) return null;

    if (color === 'primary')
      return TdIconBackgroundColorPipe.getLinearGradient(this.themeService.getCurrentThemeDetail().primary);
    else if (color === 'accent')
      return TdIconBackgroundColorPipe.getLinearGradient(this.themeService.getCurrentThemeDetail().accent);
    else if (color === 'warn')
      return TdIconBackgroundColorPipe.getLinearGradient(this.themeService.getCurrentThemeDetail().warn);

    return TdIconBackgroundColorPipe.getLinearGradient(color);
  }

  public static getLinearGradient(color: string): string {
    return `linear-gradient(135deg, color-mix(in srgb, ${color} 15%, white), ${color})`;
  }
}
