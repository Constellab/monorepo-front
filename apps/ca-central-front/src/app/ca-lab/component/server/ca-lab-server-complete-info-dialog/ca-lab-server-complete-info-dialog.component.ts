import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaServerCompleteInfo } from '../../../../ca-core/model/entities/lab/ca-lab-server.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { CaLabServerCompleteInfoComponent } from '../ca-lab-server-complete-info/ca-lab-server-complete-info.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-server-complete-info-dialog',
  templateUrl: './ca-lab-server-complete-info-dialog.component.html',
  styleUrls: ['./ca-lab-server-complete-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    CaLabServerCompleteInfoComponent,
    TranslatePipe,
  ],
})
export class CaLabServerCompleteInfoDialogComponent implements OnInit {
  private labService = inject(CaLabService);
  private labId = inject(MAT_DIALOG_DATA);

  serverInfo$: Observable<CaServerCompleteInfo> = this.labService.getServerInfo(this.labId);

  ngOnInit(): void {}
}
