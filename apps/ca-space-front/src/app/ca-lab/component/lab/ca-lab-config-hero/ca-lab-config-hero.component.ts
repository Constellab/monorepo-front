import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabHeroHeaderComponent } from '../ca-lab-hero-header/ca-lab-hero-header.component';

interface CaLabHealthCheck {
  label: string;
  ok: boolean;
}

/**
 * Configuration-page hero. Wraps the shared hero header (lab name, status, lifecycle
 * actions and the notice banners), adds a projected Restart action, the in-progress task
 * block and a health-checks footer.
 */
@Component({
  selector: 'ca-lab-config-hero',
  templateUrl: './ca-lab-config-hero.component.html',
  styleUrls: ['./ca-lab-config-hero.component.scss'],
  imports: [MatIcon, MatButton, CaLabHeroHeaderComponent, AsyncPipe, TranslatePipe],
})
export class CaLabConfigHeroComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private configState = inject(CaLabDetailConfigPageState);
  private managerState = inject(LmlLabManagerState);

  isCloud$: Observable<boolean> = this.state.isCloud$();

  status$: Observable<CaLabStatusDTO> = this.configState.getStatus$();
  labIsRunning$: Observable<boolean> = this.state.labIsRunning$();

  /** The 5 health checks, filtered to those relevant to this lab type. */
  healthChecks$: Observable<CaLabHealthCheck[]>;

  ngOnInit(): void {
    this.healthChecks$ = combineLatest([this.status$, this.isCloud$]).pipe(
      map(([status, isCloud]) => this.buildHealthChecks(status, isCloud))
    );
  }

  private buildHealthChecks(status: CaLabStatusDTO, isCloud: boolean): CaLabHealthCheck[] {
    const checks: CaLabHealthCheck[] = [];
    if (isCloud) {
      checks.push({ label: 'lab_health_server_instance', ok: status.hasServerInstanceId });
      checks.push({ label: 'lab_health_server_volume', ok: status.hasServerVolumeId });
      checks.push({ label: 'lab_health_dns', ok: status.dnsConfigured });
    }
    checks.push({ label: 'lab_health_lab_manager', ok: status.labManagerIsRunning });
    checks.push({ label: 'lab_health_lab_service', ok: status.labIsRunning });
    return checks;
  }

  restartLab(): void {
    this.managerState.initLab({ text: 'lml.lab_manager_restart', translateText: true });
  }
}
