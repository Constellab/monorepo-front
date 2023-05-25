import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {LabProtocolTemplate} from '../../../../model/entities/process/lab-protocol-template.entity';

@Component({
  selector: 'lab-select-protocol-template-dialog',
  templateUrl: './lab-select-protocol-template-dialog.component.html',
  styleUrls: ['./lab-select-protocol-template-dialog.component.scss'],
})
export class LabSelectProtocolTemplateDialogComponent {

  constructor(private dialogRef: MatDialogRef<LabSelectProtocolTemplateDialogComponent>) {
  }

  onTemplateSelected(template: LabProtocolTemplate): void {
    this.dialogRef.close(template);
  }
}
