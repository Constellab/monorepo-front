import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaCloudProviderInlineComponent } from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { CaLabServerInfoDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabVolumeHistoryDialogComponent } from '../../volume/ca-lab-volume-history-dialog/ca-lab-volume-history-dialog.component';

@Component({
  selector: 'ca-lab-server-info-card',
  templateUrl: './ca-lab-server-info-card.component.html',
  styleUrls: ['./ca-lab-server-info-card.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlSectionModule,
    FlKeyValueModule,
    CaCloudProviderInlineComponent,
    MatIconButton,
    MatTooltip,
    TranslatePipe,
  ],
})
export class CaLabServerInfoCardComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) labId: string;

  serverInfo$: Observable<CaLabServerInfoDTO>;

  ngOnInit(): void {
    this.serverInfo$ = this.labService.getLabServerInfo(this.labId);
  }

  openVolumeHistoryDialog(): void {
    this.dialogService.openSmallDialog(CaLabVolumeHistoryDialogComponent, { data: this.labId });
  }
}
