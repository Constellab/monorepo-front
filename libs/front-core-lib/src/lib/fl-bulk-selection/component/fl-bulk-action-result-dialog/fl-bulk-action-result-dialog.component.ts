import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClBulkActionResult } from '@monorepo/core-lib';

@Component({
  selector: 'fl-bulk-action-result-dialog',
  templateUrl: './fl-bulk-action-result-dialog.component.html',
  styleUrls: ['./fl-bulk-action-result-dialog.component.scss'],
  standalone: false,
})
export class FlBulkActionResultDialogComponent {
  result: ClBulkActionResult = inject(MAT_DIALOG_DATA);
}
