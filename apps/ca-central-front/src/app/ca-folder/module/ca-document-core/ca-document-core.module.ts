import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaDocumentTableComponent } from './component/ca-document-table/ca-document-table.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaDocumentNameFormDialogComponent } from './component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CaNotificationCoreModule } from '../../../ca-core/entity-module/ca-notification-core/ca-notification-core.module';
import { CaHierarchyObjectCoreModule } from '../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';

@NgModule({
  declarations: [CaDocumentTableComponent, CaDocumentNameFormDialogComponent],
  exports: [CaDocumentTableComponent, CaDocumentNameFormDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    CaCoreModule,
    CaNotificationCoreModule,
    CaHierarchyObjectCoreModule,
  ],
})
export class CaDocumentCoreModule {}
