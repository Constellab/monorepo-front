import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiProgressBar, LiProgressBarService } from '@monorepo/lab-lib/li-core';
import { LiProgressBarInfoComponent } from '../li-progress-bar-info/li-progress-bar-info.component';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

/**
 * Show information about a {@link LiProgressBar} in a dialog
 */
@Component({
  selector: 'li-progress-bar-info-dialog',
  templateUrl: './li-progress-bar-info-dialog.component.html',
  styleUrls: ['./li-progress-bar-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatIconAnchor,
    MatTooltip,
    MatIcon,
    MatDialogContent,
    FlSectionModule,
    LiProgressBarInfoComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LiProgressBarInfoDialogComponent implements OnInit {
  private labProgressBarService = inject(LiProgressBarService);

  progressBar$: Observable<LiProgressBar>;

  downloadUrl$: Observable<string>;

  constructor() {
    const progressBar$ = inject<Observable<LiProgressBar>>(MAT_DIALOG_DATA);

    this.progressBar$ = progressBar$;
  }

  ngOnInit(): void {
    this.downloadUrl$ = this.progressBar$.pipe(
      map((progressBar) => this.labProgressBarService.getDownloadProgressBarUrl(progressBar.id))
    );
  }
}
