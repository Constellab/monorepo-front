import { Component, inject } from '@angular/core';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { Observable } from 'rxjs';
import { LabSharedEntity } from '../../../../model/entities/lab-share.entity';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabSharedEntityOriginComponent } from '../lab-shared-entity-origin/lab-shared-entity-origin.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show the origin of a shared resource.
 */
@Component({
  selector: 'lab-shared-entity-origin-dialog',
  templateUrl: './lab-shared-entity-origin-dialog.component.html',
  styleUrls: ['./lab-shared-entity-origin-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    LabSharedEntityOriginComponent,
    TranslatePipe,
  ],
})
export class LabSharedEntityOriginDialogComponent {
  private resourceId = inject(MAT_DIALOG_DATA);
  private resourceService = inject(LabResourceService);

  resourceShare$: Observable<LabSharedEntity> = this.resourceService.getSharedResourceOrigin(this.resourceId);
}
