import { Component, Input, OnInit, inject } from '@angular/core';
import { CaLabServerInfoDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { Observable } from 'rxjs';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaLabVolumeHistoryDialogComponent } from '../../volume/ca-lab-volume-history-dialog/ca-lab-volume-history-dialog.component';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { CaCloudProviderInlineComponent } from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

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
