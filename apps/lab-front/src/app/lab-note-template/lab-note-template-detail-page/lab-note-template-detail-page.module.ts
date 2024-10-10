import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabNoteTemplateDetailPageComponent
} from './lab-note-template-detail-page/lab-note-template-detail-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabCoreModule } from '../../lab-core/lab-core.module';

@NgModule({
  declarations: [
    LabNoteTemplateDetailPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    LabCoreModule,
    ReactiveFormsModule
  ]
})
export class LabNoteTemplateDetailPageModule {
}
