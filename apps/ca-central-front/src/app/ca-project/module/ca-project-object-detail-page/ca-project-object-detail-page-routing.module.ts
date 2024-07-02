import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  CaProjectDetailPageComponent
} from '../ca-project-detail-page/component/ca-project-detail-page/ca-project-detail-page.component';
import {
  CaExperimentDetailPageComponent
} from '../ca-experiment-detail-page/component/ca-experiment-detail-page/ca-experiment-detail-page.component';
import {
  CaReportDetailPageComponent
} from '../ca-report-detail-page/component/ca-report-detail-page/ca-report-detail-page.component';
import {
  CaProjectObjectDetailPageComponent
} from './component/ca-project-object-detail-page/ca-project-object-detail-page.component';
import {
  CaDocumentDetailPageComponent
} from '../ca-document-detail-page/component/ca-document-detail-page/ca-document-detail-page.component';
import {
  CaProjectActivityPageComponent
} from '../ca-project-activity-page/component/ca-project-activity-page/ca-project-activity-page.component';
import {
  CaDocumentPreviewPageComponent
} from '../ca-document-detail-page/component/ca-document-preview-page/ca-document-preview-page.component';

const routes: Route[] = [
  {
    path: '', component: CaProjectObjectDetailPageComponent, children: [
      {path: ':projectId', component: CaProjectDetailPageComponent},
      {path: ':projectId/activity', component: CaProjectActivityPageComponent},
      {path: 'experiment/:experimentId', component: CaExperimentDetailPageComponent},
      {path: 'report/:reportId', component: CaReportDetailPageComponent},
      {path: 'document/:documentId', component: CaDocumentDetailPageComponent},
      {path: 'document/:documentId/preview', component: CaDocumentPreviewPageComponent}
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
export class CaProjectDetailPageRoutingModule {
}

