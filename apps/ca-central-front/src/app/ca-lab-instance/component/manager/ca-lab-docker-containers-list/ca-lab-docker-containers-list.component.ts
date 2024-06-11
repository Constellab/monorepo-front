import { Component, Input } from '@angular/core';
import { CaLabDockerPs } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaLabDockerContainerLogsComponent,
  CaLabDockerContainerLogsInput
} from '../ca-lab-docker-container-logs/ca-lab-docker-container-logs.component';
import { ClHelpService } from '@monorepo/core-lib';
import { CaLabInstanceDetailManagerState } from '../../../state/ca-lab-instance-detail-manager.state';

/**
 * Component to list the docker container with name, status and information
 */
@Component({
  selector: 'ca-lab-docker-containers-list',
  templateUrl: './ca-lab-docker-containers-list.component.html',
  styleUrls: ['./ca-lab-docker-containers-list.component.scss']
})
export class CaLabDockerContainersListComponent {

  @Input() labInstanceId: string;
  @Input() containers: CaLabDockerPs[];

  constructor(private dialogService: FlDialogService,
              private managerState: CaLabInstanceDetailManagerState) {
  }

  viewContainerLogs(container: CaLabDockerPs, mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
    const input: CaLabDockerContainerLogsInput = {
      labInstanceId: this.labInstanceId,
      containerName: container.names
    };

    this.dialogService.openMediumDialog(CaLabDockerContainerLogsComponent, { data: input });
  }

  stopEventPropagation(mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
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
