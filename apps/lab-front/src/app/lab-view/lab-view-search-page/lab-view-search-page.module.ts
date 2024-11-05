import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabViewSearchPageComponent } from './lab-view-search-page/lab-view-search-page.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import { LabViewConfigCoreModule } from '../../lab-core/entity-module/lab-view-config-core/lab-view-config-core.module';

@NgModule({
  declarations: [LabViewSearchPageComponent],
  imports: [CommonModule, LabCoreModule, LabViewConfigCoreModule],
})
export class LabViewSearchPageModule {}
