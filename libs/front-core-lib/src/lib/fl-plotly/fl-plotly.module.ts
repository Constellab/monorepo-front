import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlPlotlyComponent } from './fl-plotly/fl-plotly.component';

@NgModule({
  declarations: [FlPlotlyComponent],
  exports: [FlPlotlyComponent],
  imports: [CommonModule, FlLoaderModule],
})
export class FlPlotlyModule {}
