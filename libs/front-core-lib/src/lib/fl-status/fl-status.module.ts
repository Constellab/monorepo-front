import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';

import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlStatusChipComponent } from './component/fl-status-chip/fl-status-chip.component';

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
export class FlStatusModule {}

