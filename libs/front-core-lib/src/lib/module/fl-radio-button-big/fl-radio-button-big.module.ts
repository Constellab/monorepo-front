import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatRadioModule} from '@angular/material/radio';
import {FlRadioButtonBigDirective} from './directive/fl-radio-button-big.directive';


@NgModule({
  declarations: [
    FlRadioButtonBigDirective,
  ],
  exports: [
    FlRadioButtonBigDirective,
  ],
  imports: [
    CommonModule,

    MatRadioModule,
    FlexLayoutModule,
  ]
})
export class FlRadioButtonBigModule {
}
