import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaDetailRoutePipe} from './ca-detail-route/ca-detail-route.pipe';
import {CaCommunityBrickImagePipe} from './ca-community-brick-image-pipe/ca-community-brick-image.pipe';


@NgModule({
  declarations: [
    CaDetailRoutePipe,
    CaCommunityBrickImagePipe
  ],
  exports: [
    CaDetailRoutePipe,
    CaCommunityBrickImagePipe
  ],
  imports: [
    CommonModule
  ],
})
export class CaCorePipeModule { }
