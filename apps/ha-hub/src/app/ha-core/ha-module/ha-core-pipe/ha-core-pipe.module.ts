import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaDetailRoutePipe} from './ha-detail-route/ha-detail-route.pipe';
import {HaBrickImagePipe} from './ha-brick-image/ha-brick-image.pipe';

@NgModule({
  declarations: [HaDetailRoutePipe, HaBrickImagePipe],
  imports: [CommonModule],
  exports: [HaDetailRoutePipe, HaBrickImagePipe],
})
export class HaCorePipeModule {}
