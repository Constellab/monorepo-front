import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiResourceService, LiSharedEntity } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LiSharedEntityOriginComponent } from '../li-shared-entity-origin/li-shared-entity-origin.component';

/**
 * Component to show the origin of a shared resource.
 */
@Component({
  selector: 'li-shared-entity-origin-dialog',
  templateUrl: './li-shared-entity-origin-dialog.component.html',
  styleUrls: ['./li-shared-entity-origin-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    LiSharedEntityOriginComponent,
    TranslatePipe,
  ],
})
export class LiSharedEntityOriginDialogComponent {
  private resourceId = inject(MAT_DIALOG_DATA);
  private resourceService = inject(LiResourceService);

  resourceShare$: Observable<LiSharedEntity> = this.resourceService.getSharedResourceOrigin(this.resourceId);
}
