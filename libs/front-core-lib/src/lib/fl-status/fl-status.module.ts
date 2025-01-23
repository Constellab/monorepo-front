import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlStatusChipComponent } from './component/fl-status-chip/fl-status-chip.component';
import { MatIconModule } from '@angular/material/icon';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flStatusI18n } from './i18n/fl-status.i18n';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';

@NgModule({
  declarations: [FlStatusChipComponent],
  exports: [FlStatusChipComponent],
  imports: [
    CommonModule,

    FlCoreComponentModule,
    FlIconModule,
    FlTextIconModule,
    FlTranslateModule,
    FlLoaderModule,

    MatIconModule,
    MatTooltipModule,
  ],
})
export class FlStatusModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlStatusModule', flStatusI18n);
  }
}
