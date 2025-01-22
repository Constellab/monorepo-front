import { Component, OnInit, inject } from '@angular/core';
import { LabProgressBar } from '../../../../model/entities/lab-progress-bar.entity';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabProgressBarService } from '../../../../entity-service/lab-progress-bar.service';
import { map } from 'rxjs/operators';

/**
 * Show information about a {@link LabProgressBar} in a dialog
 */
@Component({
  selector: 'lab-progress-bar-info-dialog',
  templateUrl: './lab-progress-bar-info-dialog.component.html',
  styleUrls: ['./lab-progress-bar-info-dialog.component.scss'],
  standalone: false,
})
export class LabProgressBarInfoDialogComponent implements OnInit {
  private labProgressBarService = inject(LabProgressBarService);

  progressBar$: Observable<LabProgressBar>;

  downloadUrl$: Observable<string>;

  constructor() {
    const progressBar$ = inject<Observable<LabProgressBar>>(MAT_DIALOG_DATA);

    this.progressBar$ = progressBar$;
  }

  ngOnInit(): void {
    this.downloadUrl$ = this.progressBar$.pipe(
      map((progressBar) => this.labProgressBarService.getDownloadProgressBarUrl(progressBar.id))
    );
  }
}
