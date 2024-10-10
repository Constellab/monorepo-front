import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabNoteTemplateRoutingModule } from './lab-note-template-routing.module';
import {
  LabNoteTemplatesSearchPageModule
} from './lab-note-templates-search-page/lab-note-templates-search-page.module';
import { LabNoteTemplateDetailPageModule } from './lab-note-template-detail-page/lab-note-template-detail-page.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LabNoteTemplatesSearchPageModule,
    LabNoteTemplateDetailPageModule,

    LabNoteTemplateRoutingModule,
  ]
})
export class LabNoteTemplateModule {
}
