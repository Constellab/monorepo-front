import { Component, inject, OnInit } from '@angular/core';
import { LabProgressBar } from '../../../../model/entities/lab-progress-bar.entity';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { LabProgressBarService } from '../../../../entity-service/lab-progress-bar.service';
import { map } from 'rxjs/operators';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { MatIconAnchor } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabProgressBarInfoComponent } from '../lab-progress-bar-info/lab-progress-bar-info.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Show information about a {@link LabProgressBar} in a dialog
 */
@Component({
  selector: 'lab-progress-bar-info-dialog',
  templateUrl: './lab-progress-bar-info-dialog.component.html',
  styleUrls: ['./lab-progress-bar-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatIconAnchor,
    MatTooltip,
    MatIcon,
    MatDialogContent,
    FlSectionModule,
    LabProgressBarInfoComponent,
    AsyncPipe,
    TranslatePipe,
  ],
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
