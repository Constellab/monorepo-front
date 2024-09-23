import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  CaFolderDetailPageComponent
} from '../ca-folder-detail-page/component/ca-folder-detail-page/ca-folder-detail-page.component';
import {
  CaExperimentDetailPageComponent
} from '../ca-experiment-detail-page/component/ca-experiment-detail-page/ca-experiment-detail-page.component';
import {
  CaNoteDetailPageComponent
} from '../ca-note-detail-page/component/ca-note-detail-page/ca-note-detail-page.component';
import {
  CaHierarchyObjectDetailPageComponent
} from './component/ca-hierarchy-object-detail-page/ca-hierarchy-object-detail-page.component';
import {
  CaDocumentDetailPageComponent
} from '../ca-document-detail-page/component/ca-document-detail-page/ca-document-detail-page.component';
import {
  CaFolderActivityPageComponent
} from '../ca-folder-activity-page/component/ca-folder-activity-page/ca-folder-activity-page.component';
import {
  CaDocumentPreviewPageComponent
} from '../ca-document-detail-page/component/ca-document-preview-page/ca-document-preview-page.component';

const routes: Route[] = [
  {
    path: '', component: CaHierarchyObjectDetailPageComponent, children: [
      {path: ':id', component: CaFolderDetailPageComponent},
      {path: ':id/activity', component: CaFolderActivityPageComponent},
      {path: 'experiment/:id', component: CaExperimentDetailPageComponent},
      {path: 'note/:id', component: CaNoteDetailPageComponent},
      {path: 'document/:id', component: CaDocumentDetailPageComponent},
      {path: 'document/:id/preview', component: CaDocumentPreviewPageComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CaHierarchyObjectDetailPageRoutingModule {
}

