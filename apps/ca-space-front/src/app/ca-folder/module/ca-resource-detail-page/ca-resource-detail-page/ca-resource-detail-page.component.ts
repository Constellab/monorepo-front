import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaResourceDetailComponent } from '../../ca-resource-core/ca-resource-detail/ca-resource-detail.component';

@Component({
  selector: 'ca-resource-detail-page',
  templateUrl: './ca-resource-detail-page.component.html',
  styleUrl: './ca-resource-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AsyncPipe, CaResourceDetailComponent],
})
export class CaResourceDetailPageComponent {
  private state = inject(CaHierarchyObjectDetailState);
  resourceId$ = inject(ActivatedRoute).params.pipe(map((params) => params.id));
  userRole$ = this.state.getUserRole$();

  tags = this.state.getTags();
}
