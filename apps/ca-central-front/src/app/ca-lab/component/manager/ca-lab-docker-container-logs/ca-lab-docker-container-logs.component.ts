import { Component, Inject, OnInit } from '@angular/core';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CaLabDockerContainerLogsInput {
  labId: string;
  containerName: string;
}

/**
 * Dialog to view logs of a docker container
 */
@Component({
  selector: 'ca-lab-docker-container-logs',
  templateUrl: './ca-lab-docker-container-logs.component.html',
  styleUrls: ['./ca-lab-docker-container-logs.component.scss'],
})
export class CaLabDockerContainerLogsComponent implements OnInit {
  logs$: Observable<string>;
  containerName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private input: CaLabDockerContainerLogsInput,
    private labService: CaLabService
  ) {}

  ngOnInit(): void {
    this.containerName = this.input.containerName;
    this.logs$ = this.labService.getLogs(this.input.labId, this.input.containerName);
  }
}
