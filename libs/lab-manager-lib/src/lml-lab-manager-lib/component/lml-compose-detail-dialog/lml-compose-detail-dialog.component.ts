import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlCodeDialogComponent, FlCodeDialogData } from '@monorepo/front-core-lib/fl-code-editor';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult } from '@monorepo/front-core-lib/fl-portal-actions';

import { LmlComposeState } from '../../lml-compose.state';
import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlComposeInfo } from '../../model/lml-lab-manager.class';

export interface LmlComposeDetailDialogData {
  compose: LmlComposeInfo;
}

@Component({
  selector: 'lml-compose-detail-dialog',
  templateUrl: './lml-compose-detail-dialog.component.html',
  styleUrls: ['./lml-compose-detail-dialog.component.scss'],
  standalone: false,
  providers: [LmlComposeState],
})
export class LmlComposeDetailDialogComponent implements OnInit, OnDestroy {
  private dialogRef = inject(MatDialogRef<LmlComposeDetailDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as LmlComposeDetailDialogData;
  private dialogService = inject(FlDialogService);
  private labManagerService = inject(LmlLabManagerService);

  composeState = inject(LmlComposeState);
  compose = this.data.compose;

  ngOnInit(): void {
    this.composeState.init(this.compose);
  }

  ngOnDestroy(): void {
    this.composeState.ngOnDestroy();
  }

  close(): void {
    this.dialogRef.close();
  }

  // Compose actions
  upServices(): void {
    this.composeState.upServices();
  }

  restartServices(): void {
    this.composeState.restartServices();
  }

  stopServices(): void {
    this.composeState.stopServices();
  }

  deleteServices(): void {
    this.composeState.deleteServices();
  }

  pullServices(): void {
    this.composeState.pullServices();
  }

  unregisterSubCompose(): void {
    this.composeState.unregisterSubCompose().subscribe((result) => this.onUnregisterActionResult(result));
  }

  private onUnregisterActionResult(result: FlPortalActionResult): void {
    if (result.status === 'success') {
      this.dialogRef.close();
    }
  }

  // Single container actions
  startComposeContainer(serviceName: string): void {
    this.composeState.startComposeService(serviceName);
  }

  // Show compose content
  showComposeContent(): void {
    this.labManagerService.getComposeContent(this.compose).subscribe({
      next: (response) => {
        const dialogData: FlCodeDialogData = {
          code: response.content,
          language: 'yaml',
          title: `${this.compose.brickName} - ${this.compose.uniqueName} Compose`,
          readonly: true,
        };

        this.dialogService.openMediumDialog(FlCodeDialogComponent, {
          data: dialogData,
        });
      },
    });
  }
}
