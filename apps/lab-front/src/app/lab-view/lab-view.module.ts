import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabViewRoutingModule } from './lab-view-routing.module';
import { LabViewSearchPageModule } from './lab-view-search-page/lab-view-search-page.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LabViewSearchPageModule,

    LabViewRoutingModule,
  ]
})
export class LabViewModule {
}
