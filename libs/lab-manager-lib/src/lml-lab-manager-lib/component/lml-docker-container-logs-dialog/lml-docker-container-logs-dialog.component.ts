import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LmlLabManagerApiService } from '../../lml-lab-manager-api.service';

export interface LmlDockerContainerLogsInput {
  containerName: string;
}

/**
 * Dialog to view logs of a docker container
 */
@Component({
  selector: 'lml-docker-container-logs-dialog',
  templateUrl: './lml-docker-container-logs-dialog.component.html',
  styleUrls: ['./lml-docker-container-logs-dialog.component.scss'],
})
export class LmlDockerContainerLogsDialogComponent {
  input: LmlDockerContainerLogsInput = inject(MAT_DIALOG_DATA);
  private labService = inject(LmlLabManagerApiService);

  logs$: Observable<string> = this.labService.getLogs(this.input.containerName);
}
