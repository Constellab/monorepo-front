import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaLabBusyStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

/**
 * Component to show the current running task of the lab
 */
@Component({
  selector: 'ca-lab-current-task',
  templateUrl: './ca-lab-current-task.component.html',
  styleUrl: './ca-lab-current-task.component.scss',
  imports: [FlLoaderModule, RouterLink, MatTooltip, AsyncPipe, TranslatePipe, FlDateModule],
})
export class CaLabCurrentTaskComponent implements OnInit {
  /**
   * If true the text is a link to open the lab configuration will be shown
   */
  @Input() showConfigRouteLink: boolean = false;

  configRoute: string;

  private state = inject(CaLabDetailPageState);

  busyStatus$: Observable<CaLabBusyStatusDTO>;
  ngOnInit(): void {
    this.busyStatus$ = this.state.getBusyStatus$();
    this.configRoute = CaRouterService.getLabConfigRoute(this.state.getLabId());
  }
}
