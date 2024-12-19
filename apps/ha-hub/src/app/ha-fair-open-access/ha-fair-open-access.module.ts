import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HaFairOpenAccessPageComponent } from './component/ha-fair-open-access-page/ha-fair-open-access-page.component';
import { FlTranslateModule } from '@monorepo/front-core-lib';

@NgModule({
  declarations: [HaFairOpenAccessPageComponent],
  imports: [CommonModule, FlTranslateModule, NgOptimizedImage],
  exports: [HaFairOpenAccessPageComponent],
})
export class HaFairOpenAccessModule {}
