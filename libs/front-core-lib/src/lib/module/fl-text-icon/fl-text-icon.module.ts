import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FlTextIconComponent} from './fl-text-icon/fl-text-icon.component';
import {FlTextOkNokComponent} from './fl-text-ok-nok/fl-text-ok-nok.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

/**
 * Module that contain the TextIconComponent to align text with icon
 */
@NgModule({
  declarations: [
    FlTextIconComponent,
    FlTextOkNokComponent
  ],
  exports: [
    FlTextIconComponent,
    FlTextOkNokComponent,
  ],
  imports: [
    CommonModule,

    MatIconModule,
    MatTooltipModule,
  ]
})
export class FlTextIconModule {
}
