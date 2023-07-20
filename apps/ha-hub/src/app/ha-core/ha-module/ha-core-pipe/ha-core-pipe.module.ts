import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaDetailRoutePipe} from './ha-detail-route/ha-detail-route.pipe';

@NgModule({
  declarations: [HaDetailRoutePipe],
  imports: [CommonModule],
  exports: [HaDetailRoutePipe],
})
export class HaCorePipeModule {}
