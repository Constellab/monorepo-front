import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { map } from 'rxjs/operators';
import { CaLabStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { ClDateHelper } from '@monorepo/core-lib';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { LmlDockerProgress, LmlLabManagerStatus } from '@monorepo/lab-manager-lib';

interface CaCurrentTask {
  text: string;
  progress?: LmlDockerProgress;
}


/**
 * Component to show the current running task of the lab
 */
@Component({
  selector: 'ca-lab-current-task',
  templateUrl: './ca-lab-current-task.component.html',
  styleUrl: './ca-lab-current-task.component.scss',
})
export class CaLabCurrentTaskComponent implements OnInit {
  /**
   * If true the text is a link to open the lab configuration will be shown
   */
  @Input() showConfigRouteLink: boolean = false;

  currentTask$: Observable<CaCurrentTask>;

  configRoute: string;

  private state = inject(CaLabDetailPageState);
  private translateService = inject(FlTranslateService);

  ngOnInit(): void {
    this.currentTask$ = this.state
      .getFullStatus$()
      .pipe(map(([status, managerStatus]) => this.getRunningTaskMessage(status, managerStatus)));

    this.configRoute = CaRouterService.getLabConfigRoute(this.state.getLabId());
  }

  getRunningTaskMessage(status: CaLabStatusDTO, managerStatus?: LmlLabManagerStatus): CaCurrentTask {
    if (status == null) return null;

    // if there is a server task, return it
    if (status.serverTaskStatus.value === 'RUNNING') {
      return {
        text:
          `${this.translateService.translate(this.getStatusRunningMessage(status))} - ` +
          `${status.serverTaskText} - ${ClDateHelper.fromNow(status.serverTaskDatetime)}`,
      };
    }

    if (status.labStatus.value === 'SERVER_STARTING') {
      return {
        text: this.translateService.translate('lab_is_starting'),
      }
    }

    if (status.labStatus.value === 'SERVER_STOPPING') {
      return {
        text: this.translateService.translate('lab_is_stopping'),
      }
    }

    // if all the lab containers are running but the lab is not running, it means the lab is starting
    if (managerStatus == null) return null;
    if (managerStatus.labStatus === 'STARTING') {
      return {
        text: this.translateService.translate('lab_is_starting'),
        progress: managerStatus.glabStatus?.startProgress
      }
    }

    return null;
  }

  private getStatusRunningMessage(status: CaLabStatusDTO): string {
    if (status.labStatus.value === 'SERVER_STARTING') {
      return 'lab_is_starting';
    } else if (status.labStatus.value === 'SERVER_STOPPING') {
      return 'lab_is_stopping';
    }
    return 'lab_task_is_running';
  }
}
