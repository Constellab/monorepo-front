import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaUpdateStatusFormDialogComponent } from './ca-update-status-form-dialog/ca-update-status-form-dialog.component';
import { CaStatusHistoryListDialogComponent } from './ca-status-history-list-dialog/ca-status-history-list-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaCustomMaterialModule } from '../../custom-material/ca-custom-material.module';
import { CaStatusHistoryCardComponent } from './ca-status-history-card/ca-status-history-card.component';
import { CaCustomLibraryModule } from '../../custom-library/ca-custom-library.module';
import { CaStatusHistoryTableComponent } from './ca-status-history-table/ca-status-history-table.component';

/**
 * Module that contains the components to manage the status and StatusHistory
 */
@NgModule({
  declarations: [
    CaUpdateStatusFormDialogComponent,
    CaStatusHistoryListDialogComponent,
    CaStatusHistoryCardComponent,
    CaStatusHistoryTableComponent,
  ],
  exports: [
    CaUpdateStatusFormDialogComponent,
    CaStatusHistoryListDialogComponent,
    CaStatusHistoryCardComponent,
    CaStatusHistoryTableComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CaCustomMaterialModule, CaCustomLibraryModule],
})
export class CaStatusModule {}
