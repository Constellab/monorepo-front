import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabNoteRoutingModule } from './lab-note-routing.module';
import { LabNoteSearchPageModule } from './module/lab-note-search-page/lab-note-search-page.module';
import { LabNoteDetailPageModule } from './module/lab-note-detail-page/lab-note-detail-page.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LabNoteSearchPageModule, LabNoteDetailPageModule, LabNoteRoutingModule],
})
export class LabNoteModule {}
