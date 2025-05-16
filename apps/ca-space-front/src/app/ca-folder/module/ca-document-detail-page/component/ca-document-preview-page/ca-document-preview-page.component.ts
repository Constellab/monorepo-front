import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CaDocumentPreviewComponent } from '../../../ca-document-core/component/ca-document-preview/ca-document-preview.component';
import { CaHierarchyObjectBreadcrumbComponent } from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

/**
 * Page to show preview for document in Iframe (for office documents)
 */
@Component({
  selector: 'ca-document-preview-page',
  templateUrl: './ca-document-preview-page.component.html',
  styleUrl: './ca-document-preview-page.component.scss',
  imports: [CaHierarchyObjectBreadcrumbComponent, CaDocumentPreviewComponent, AsyncPipe],
})
export class CaDocumentPreviewPageComponent {
  private state = inject(CaHierarchyObjectDetailState);
  documentId$ = inject(ActivatedRoute).params.pipe(map((params) => params.id));
  userRole$ = this.state.getUserRole$();
  tags = this.state.getTags();
}
