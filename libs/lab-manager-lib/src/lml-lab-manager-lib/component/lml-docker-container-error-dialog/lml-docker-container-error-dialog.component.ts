import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LmlDockerErrorLogs } from '../../model/lml-lab-manager.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'lml-docker-container-error-dialog',
    templateUrl: './lml-docker-container-error-dialog.component.html',
    styleUrl: './lml-docker-container-error-dialog.component.scss',
    standalone: false
})
export class LmlDockerContainerErrorDialogComponent {
  logs$: Observable<LmlDockerErrorLogs> = inject(MAT_DIALOG_DATA);
}
