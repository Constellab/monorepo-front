import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabResourceRoutingModule } from './lab-resource-routing.module';
import { LabResourceSearchPageModule } from './lab-resource-search-page/lab-resource-search-page.module';
import { LabResourceDetailPageModule } from './lab-resource-detail-page/lab-resource-detail-page.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LabResourceSearchPageModule, LabResourceDetailPageModule, LabResourceRoutingModule],
})
export class LabResourceModule {}
