import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FlButtonLoaderComponent } from './fl-button-loader/fl-button-loader.component';
import { FlLoaderComponent } from './fl-loader/fl-loader.component';
import { FlProgressLoaderComponent } from './fl-progress-loader/fl-progress-loader.component';

@NgModule({
  declarations: [FlLoaderComponent, FlButtonLoaderComponent, FlProgressLoaderComponent],
  exports: [FlLoaderComponent, FlButtonLoaderComponent, FlProgressLoaderComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class FlLoaderModule {}
