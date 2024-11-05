import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LabNoteTemplateDetailPageComponent } from './lab-note-template-detail-page/lab-note-template-detail-page/lab-note-template-detail-page.component';
import { LabNoteTemplatesSearchPageComponent } from './lab-note-templates-search-page/lab-note-templates-search-page/lab-note-templates-search-page.component';

const routes: Routes = [
  { path: '', component: LabNoteTemplatesSearchPageComponent },
  { path: ':id', component: LabNoteTemplateDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabNoteTemplateRoutingModule {}
