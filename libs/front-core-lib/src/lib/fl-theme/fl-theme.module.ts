import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { FL_THEME_SERVICE_CONFIG, FlThemeServiceConfig } from './fl-theme.service';
import { FlThemeSwitchPipe } from './pipe/fl-theme-switch.pipe';

@NgModule({
  declarations: [FlThemeSwitchPipe],
  exports: [FlThemeSwitchPipe],
  imports: [CommonModule],
})
export class FlThemeModule {

  public static forRoot(customConfig: FlThemeServiceConfig): ModuleWithProviders<FlThemeModule> {
    return {
      ngModule: FlThemeModule,
      providers: [
        {
          provide: FL_THEME_SERVICE_CONFIG,
          useValue: customConfig,
        },
      ],
    };
  }
}
