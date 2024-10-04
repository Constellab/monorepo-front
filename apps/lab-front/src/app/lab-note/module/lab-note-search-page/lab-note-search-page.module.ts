import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabNoteSearchPageComponent } from './component/lab-note-search-page/lab-note-search-page.component';
import { LabNoteCoreModule } from '../../../lab-core/entity-module/lab-note-core/lab-note-core.module';


@NgModule({
  declarations: [
    LabNoteSearchPageComponent
  ],
  imports: [
    CommonModule,

    LabNoteCoreModule,
  ]
})
export class LabNoteSearchPageModule { }
