import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlTextIconComponent } from './fl-text-icon/fl-text-icon.component';
import { FlTextOkNokComponent } from './fl-text-ok-nok/fl-text-ok-nok.component';

/**
 * Module that contain the TextIconComponent to align text with icon
 */
@NgModule({
  declarations: [FlTextIconComponent, FlTextOkNokComponent],
  exports: [FlTextIconComponent, FlTextOkNokComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
})
export class FlTextIconModule {}
