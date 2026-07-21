import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { CaHierarchyObjectBreadcrumbComponent } from '../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaResourceDetailComponent } from '../../ca-resource-core/ca-resource-detail/ca-resource-detail.component';

@Component({
  selector: 'ca-resource-detail-page',
  templateUrl: './ca-resource-detail-page.component.html',
  styleUrl: './ca-resource-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    AsyncPipe,
    CaResourceDetailComponent,
    MatIcon,
    TranslatePipe,
    MatTooltipModule,
  ],
})
export class CaResourceDetailPageComponent {
  private state = inject(CaHierarchyObjectDetailState);
  resourceId$ = inject(ActivatedRoute).params.pipe(map((params) => params.id));
  userRole$ = this.state.getUserRole$();

  tags = this.state.getTags();

  headerHidden = this.state.isHeaderHidden;

  showHeader(): void {
    this.state.updateViewSettings({ hideHeader: false });
  }
}
