import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaCloudProviderInlineComponent } from '../../../../ca-core/entity-module/ca-cloud-provider-core/component/ca-cloud-provider-inline/ca-cloud-provider-inline.component';
import { CaCityComponent } from '../../../../ca-core/entity-module/ca-config-core/component/ca-city/ca-city.component';
import { CaLab, CaLabServerInfoDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabVolumeHistoryDialogComponent } from '../../volume/ca-lab-volume-history-dialog/ca-lab-volume-history-dialog.component';

/**
 * Read-only dialog showing all lab details in a clean 2-column grid: lab info
 * (type, URL, region, billing, platform) and — for server-backed labs — the full
 * cloud server spec (provider, CPU, RAM, GPU, volume).
 */
@Component({
  selector: 'ca-lab-info-dialog',
  templateUrl: './ca-lab-info-dialog.component.html',
  styleUrls: ['./ca-lab-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatIcon,
    MatButton,
    CaCityComponent,
    CaCloudProviderInlineComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabInfoDialogComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  lab$: Observable<CaLab> = this.state.getLab$();
  serverInfo = signal<CaLabServerInfoDTO | null>(null);

  ngOnInit(): void {
    this.lab$.subscribe((lab) => {
      if (lab.typeObj.isOnServer && !this.serverInfo()) {
        this.labService.getLabServerInfo(lab.id).subscribe((info) => this.serverInfo.set(info));
      }
    });
  }

  openVolumeHistory(): void {
    this.dialogService.openSmallDialog(CaLabVolumeHistoryDialogComponent, {
      data: this.state.getLabId(),
      viewContainerRef: this.viewContainerRef,
    });
  }
}
