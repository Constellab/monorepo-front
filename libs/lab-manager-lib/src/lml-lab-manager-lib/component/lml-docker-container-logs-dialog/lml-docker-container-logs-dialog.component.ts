import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { LmlDockerLogs } from '../../model/lml-lab-manager.class';

export interface LmlDockerContainerLogsInput {
  title: FlTranslatableText;
  logs$: Observable<LmlDockerLogs>;
}

/**
 * Dialog to view logs of a docker container
 */
@Component({
  selector: 'lml-docker-container-logs-dialog',
  templateUrl: './lml-docker-container-logs-dialog.component.html',
  styleUrls: ['./lml-docker-container-logs-dialog.component.scss'],
  standalone: false,
})
export class LmlDockerContainerLogsDialogComponent {
  input: LmlDockerContainerLogsInput = inject(MAT_DIALOG_DATA);
}
