import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { map } from 'rxjs/operators';
import { CaConstellabDocumentDetailComponent } from '../../../ca-document-core/component/ca-constellab-document-detail/ca-constellab-document-detail.component';
import { CaHierarchyObjectBreadcrumbComponent } from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

/**
 * Page to show a constellab document with the possibility to edit it.
 */
@Component({
  selector: 'ca-constellab-document-detail-page',
  templateUrl: './ca-constellab-document-detail-page.component.html',
  styleUrls: ['./ca-constellab-document-detail-page.component.scss'],
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    FlSectionModule,
    FlFormModule,
    FlCardModule,
    FlUserModule,
    TeTextEditorModule,
    ReactiveFormsModule,
    FlTagModule,
    CaConstellabDocumentDetailComponent,
    AsyncPipe,
  ],
})
export class CaConstellabDocumentDetailPageComponent {
  private state = inject(CaHierarchyObjectDetailState);

  documentId$ = inject(ActivatedRoute).params.pipe(map((params) => params.id));
  userRole$ = this.state.getUserRole$();
  tags = this.state.getTags();
}
