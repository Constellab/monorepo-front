import { Component, inject, input, OnInit, signal, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLab, CaLabServerInfoDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabHeroHeaderComponent } from '../ca-lab-hero-header/ca-lab-hero-header.component';
import { CaLabInfoDialogComponent } from '../ca-lab-info-dialog/ca-lab-info-dialog.component';

/**
 * Dashboard hero strip: the shared hero header (lab name, status & lifecycle actions)
 * plus a bottom strip of key facts (type, region, billing and — for server-backed labs —
 * the compute server summary). A "Details" button opens the full lab info dialog.
 */
@Component({
  selector: 'ca-lab-hero',
  templateUrl: './ca-lab-hero.component.html',
  styleUrls: ['./ca-lab-hero.component.scss'],
  imports: [MatIcon, MatButton, CaLabHeroHeaderComponent, TranslatePipe],
})
export class CaLabHeroComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  lab = input.required<CaLab>();

  serverInfo = signal<CaLabServerInfoDTO | null>(null);

  ngOnInit(): void {
    const lab = this.lab();
    if (lab.typeObj.isOnServer) {
      this.labService.getLabServerInfo(lab.id).subscribe((info) => this.serverInfo.set(info));
    }
  }

  /** Compact one-line server summary, e.g. "OVH · 2 vCPU · 32 GB". */
  serverSummary(info: CaLabServerInfoDTO): string {
    const parts: string[] = [];
    if (info.cloudProvider?.name) parts.push(info.cloudProvider.name);
    if (info.cpuCount) parts.push(`${info.cpuCount} vCPU`);
    if (info.ram) parts.push(`${info.ram} GB`);
    return parts.join(' · ');
  }

  openDetails(): void {
    this.dialogService.openSmallDialog(CaLabInfoDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    });
  }
}
