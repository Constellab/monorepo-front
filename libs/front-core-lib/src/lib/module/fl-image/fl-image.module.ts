import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlRoundImageComponent} from './fl-round-image/fl-round-image.component';


/**
 * Module that contains Component to display Images.
 *
 * Contains: RoundImage
 */
@NgModule({
  declarations: [
    FlRoundImageComponent
  ],
  exports: [
    FlRoundImageComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class FlImageModule {
}
