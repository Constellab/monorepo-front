import { Component, inject, Input } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { LmlComposeState } from '../../lml-compose.state';
import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { LmlDockerInspect } from '../../model/lml-lab-manager.class';
import {
  LmlDockerContainerLogsDialogComponent,
  LmlDockerContainerLogsInput,
} from '../lml-docker-container-logs-dialog/lml-docker-container-logs-dialog.component';

/**
 * Component to list the docker container with name, status and information
 */
@Component({
  selector: 'lml-docker-containers-list',
  templateUrl: './lml-docker-containers-list.component.html',
  styleUrls: ['./lml-docker-containers-list.component.scss'],
  standalone: false,
})
export class LmlDockerContainersListComponent {
  @Input({ required: true }) containers: LmlDockerInspect[];
  @Input() readonly: boolean = false;

  private composeState = inject(LmlComposeState);

  private dialogService = inject(FlDialogService);
  private managerState = inject(LmlLabManagerState);
  private managerService = inject(LmlLabManagerService);

  viewContainerLogs(container: LmlDockerInspect, mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
    const input: LmlDockerContainerLogsInput = {
      title: { text: container.names, translateText: false },
      getLogs: () => this.managerService.getLogs(container.names),
      refreshInterval: this.managerService.getLogRetrievalInterval(),
    };

    this.dialogService.openMediumDialog(LmlDockerContainerLogsDialogComponent, {
      data: input,
    });
  }

  stopEventPropagation(mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
  }

  downloadLogs(containerName: string): void {
    this.managerState.downloadLogs(containerName);
  }

  showErrors(containerName: string): void {
    const input: LmlDockerContainerLogsInput = {
      title: { text: containerName, translateText: false },
      getLogs: () => this.managerService.getContainerErrorLogs(containerName),
      refreshInterval: this.managerService.getLogRetrievalInterval(),
    };

    this.dialogService.openMediumDialog(LmlDockerContainerLogsDialogComponent, {
      data: input,
    });
  }

  startComposeContainer(containerName: string): void {
    this.managerState.startContainer(containerName);
  }

  stopContainer(containerName: string): void {
    this.managerState.stopContainer(containerName);
  }

  deleteContainer(containerName: string): void {
    this.managerState.deleteContainer(containerName);
  }
}
