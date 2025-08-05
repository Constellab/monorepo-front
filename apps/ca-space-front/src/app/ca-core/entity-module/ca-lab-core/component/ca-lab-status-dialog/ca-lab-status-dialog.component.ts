import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { Observable } from 'rxjs';

import { CaLabService } from '../../../../service-api/ca-lab.service';

/**
 * Dialog to check the lab status
 */
@Component({
  selector: 'ca-lab-status-dialog',
  templateUrl: './ca-lab-status-dialog.component.html',
  styleUrls: ['./ca-lab-status-dialog.component.scss'],
  imports: [FlSectionModule, FlJsonEditorModule],
})
export class CaLabStatusDialogComponent implements OnInit {
  private labId = inject(MAT_DIALOG_DATA);
  private labService = inject(CaLabService);

  status$: Observable<any>;

  ngOnInit(): void {
    this.status$ = this.labService.checkStatus(this.labId);
  }
}
