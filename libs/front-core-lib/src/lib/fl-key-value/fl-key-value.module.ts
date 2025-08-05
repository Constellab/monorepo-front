import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlKeyComponent } from './fl-key/fl-key.component';
import { FlKeyValueComponent } from './fl-key-value/fl-key-value.component';

@NgModule({
  declarations: [FlKeyValueComponent, FlKeyComponent],
  exports: [FlKeyValueComponent, FlKeyComponent],
  imports: [CommonModule],
})
export class FlKeyValueModule {}
