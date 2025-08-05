import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { map } from 'rxjs/operators';

import { CaHierarchyObjectBreadcrumbComponent } from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaNoteDetailComponent } from '../ca-note-detail/ca-note-detail.component';

@Component({
  selector: 'ca-note-detail-page',
  templateUrl: './ca-note-detail-page.component.html',
  styleUrls: ['./ca-note-detail-page.component.scss'],
  imports: [CaHierarchyObjectBreadcrumbComponent, FlSectionModule, CaNoteDetailComponent, AsyncPipe],
})
export class CaNoteDetailPageComponent {
  private state = inject(CaHierarchyObjectDetailState);
  noteId$ = inject(ActivatedRoute).params.pipe(map((params) => params.id));
  userRole$ = this.state.getUserRole$();

  tags = this.state.getTags();
}
