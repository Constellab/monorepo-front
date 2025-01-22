import { Component, OnInit, inject } from '@angular/core';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlJsonEditorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-json-editor/fl-json-editor.module';

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
