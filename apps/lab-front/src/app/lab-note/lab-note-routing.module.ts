import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LabNoteDetailPageComponent } from './module/lab-note-detail-page/component/lab-note-detail-page/lab-note-detail-page.component';
import { LabNoteSearchPageComponent } from './module/lab-note-search-page/component/lab-note-search-page/lab-note-search-page.component';

const routes: Routes = [
  { path: '', component: LabNoteSearchPageComponent },
  { path: ':id', component: LabNoteDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabNoteRoutingModule {}
