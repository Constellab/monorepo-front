import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { CaConstellabDocumentDetailComponent } from '../../../ca-document-core/component/ca-constellab-document-detail/ca-constellab-document-detail.component';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

/**
 * Page to show a constellab document with the possibility to edit it.
 */
@Component({
  selector: 'ca-constellab-document-detail-page',
  templateUrl: './ca-constellab-document-detail-page.component.html',
  styleUrls: ['./ca-constellab-document-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CaConstellabDocumentDetailComponent, AsyncPipe],
})
export class CaConstellabDocumentDetailPageComponent {
  private state = inject(CaHierarchyObjectDetailState);

  documentId$ = inject(ActivatedRoute).params.pipe(map((params) => params.id));
  userRole$ = this.state.getUserRole$();
  tags = this.state.getTags();
}
