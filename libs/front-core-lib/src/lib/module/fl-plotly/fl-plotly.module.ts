import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlPlotlyComponent } from './fl-plotly/fl-plotly.component';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';


@NgModule({
  declarations: [
    FlPlotlyComponent
  ],
  exports: [
    FlPlotlyComponent
  ],
  imports: [
    CommonModule,

    FlLoaderModule
  ]
})
export class FlPlotlyModule {
}
