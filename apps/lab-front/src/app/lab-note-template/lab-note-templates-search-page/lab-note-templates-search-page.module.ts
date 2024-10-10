import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabNoteTemplatesSearchPageComponent
} from './lab-note-templates-search-page/lab-note-templates-search-page.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import {
  LabNoteTemplateCoreModule
} from '../../lab-core/entity-module/lab-note-template-core/lab-note-template-core.module';


@NgModule({
  declarations: [
    LabNoteTemplatesSearchPageComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
    LabNoteTemplateCoreModule,
  ]
})
export class LabNoteTemplatesSearchPageModule { }
