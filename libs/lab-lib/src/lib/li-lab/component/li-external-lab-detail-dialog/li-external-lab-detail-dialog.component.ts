import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiLab } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LiLabService } from '../../service/li-lab.service';

export interface LiExternalLabDetailDialogData {
  labModelId: string;
  routePath?: string;
}

@Component({
  selector: 'li-external-lab-detail-dialog',
  templateUrl: './li-external-lab-detail-dialog.component.html',
  styleUrls: ['./li-external-lab-detail-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlCoreComponentModule, FlSectionModule, TranslatePipe],
})
export class LiExternalLabDetailDialogComponent {
  private labService = inject(LiLabService);
  private data = inject<LiExternalLabDetailDialogData>(MAT_DIALOG_DATA);

  originalObjectUrl: string;

  lab$: Observable<LiLab> = this.labService.findById(this.data.labModelId).pipe(
    tap((lab) => {
      if (this.data.routePath && lab.frontUrl) {
        this.originalObjectUrl = `${lab.frontUrl}/${this.data.routePath}`;
      }
    })
  );
}
