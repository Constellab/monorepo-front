import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaServerCompleteInfo } from '../../../../ca-core/model/entities/lab/ca-lab-server.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabServerCompleteInfoComponent } from '../ca-lab-server-complete-info/ca-lab-server-complete-info.component';

@Component({
  selector: 'ca-lab-server-complete-info-dialog',
  templateUrl: './ca-lab-server-complete-info-dialog.component.html',
  styleUrls: ['./ca-lab-server-complete-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    CaLabServerCompleteInfoComponent,
    TranslatePipe,
  ],
})
export class CaLabServerCompleteInfoDialogComponent {
  private labService = inject(CaLabService);
  private labId = inject(MAT_DIALOG_DATA);

  serverInfo$: Observable<CaServerCompleteInfo> = this.labService.getServerInfo(this.labId);
}
