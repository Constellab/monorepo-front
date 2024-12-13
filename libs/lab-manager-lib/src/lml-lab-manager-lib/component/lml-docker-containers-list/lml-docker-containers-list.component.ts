import { Component, inject, Input, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib';
import { ClHelpService } from '@monorepo/core-lib';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import {
  LmlDockerContainerLogsDialogComponent,
  LmlDockerContainerLogsInput,
} from '../lml-docker-container-logs-dialog/lml-docker-container-logs-dialog.component';
import { LmlDockerPs } from '../../model/lml-lab-manager.class';

/**
 * Component to list the docker container with name, status and information
 */
@Component({
  selector: 'lml-docker-containers-list',
  templateUrl: './lml-docker-containers-list.component.html',
  styleUrls: ['./lml-docker-containers-list.component.scss'],
})
export class LmlDockerContainersListComponent {
  @Input({ required: true }) containers: LmlDockerPs[];

  private dialogService = inject(FlDialogService);
  private managerState = inject(LmlLabManagerState);
  private viewContainerRef = inject(ViewContainerRef);

  viewContainerLogs(container: LmlDockerPs, mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
    const input: LmlDockerContainerLogsInput = {
      containerName: container.names,
    };

    this.dialogService.openMediumDialog(LmlDockerContainerLogsDialogComponent, {
      data: input,
      viewContainerRef: this.viewContainerRef,
    });
  }

  stopEventPropagation(mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
  }

  downloadLogs(containerName: string): void {
    this.managerState.downloadLogs(containerName);
  }

  startComposeContainer(serviceName: string): void {
    this.managerState.startComposeContainer(serviceName);
  }

  stopContainer(containerName: string): void {
    this.managerState.stopContainer(containerName);
  }

  deleteContainer(containerName: string): void {
    this.managerState.deleteContainer(containerName);
  }
}
