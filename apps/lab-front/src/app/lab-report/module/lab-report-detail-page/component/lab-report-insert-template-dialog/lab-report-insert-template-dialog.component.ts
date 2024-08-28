import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { LabDocumentTemplate } from '../../../../../lab-core/model/entities/lab-document-template.entity';
import { LabReportContent } from '../../../../../lab-core/model/entities/lab-report.entity';
import { LabReportService } from '../../../../../lab-core/entity-service/lab-report.service';

export interface LabReportInsertTemplateDialogData {
  reportId: string;
  blockIndex: number;
}

/**
 * Dialog to insert a document template in the report
 */
@Component({
  selector: 'lab-report-insert-template-dialog',
  templateUrl: './lab-report-insert-template-dialog.component.html',
  styleUrl: './lab-report-insert-template-dialog.component.scss'
})
export class LabReportInsertTemplateDialogComponent {

  formControl: FormControl<LabDocumentTemplate> = new FormControl();
  isLoading: boolean = false;

  private dialogInput: LabReportInsertTemplateDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private reportService = inject(LabReportService);


  submit(): void {
    if (!this.isLoading && this.formControl.valid) {
      this.insertTemplate(this.formControl.value);
    }
  }

  private insertTemplate(documentTemplate: LabDocumentTemplate): void {
    this.isLoading = true;
    this.reportService.insertDocumentTemplate(this.dialogInput.reportId, {
      block_index: this.dialogInput.blockIndex.toString(),
      document_template_id: documentTemplate.id
    }).subscribe({
      next: content => this.insertTemplateSuccess(content),
      error: () => this.isLoading = false
    });
  }

  private insertTemplateSuccess(content: LabReportContent): void {
    this.isLoading = false;
    this.dialogRef.close(content);
  }
}
