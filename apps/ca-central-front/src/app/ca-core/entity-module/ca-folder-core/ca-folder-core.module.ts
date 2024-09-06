import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../ca-core.module';
import { CaFolderCardComponent } from './component/ca-folder-card/ca-folder-card.component';
import { CaFolderIconComponent } from './component/ca-folder-icon/ca-folder-icon.component';
import { CaFolderTableComponent } from './component/ca-folder-table/ca-folder-table.component';
import { CaFolderInlineComponent } from './component/ca-folder-inline/ca-folder-inline.component';
import { RouterModule } from '@angular/router';
import { CaSelectFolderDialogComponent } from './component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import { CaNotificationCoreModule } from '../ca-notification-core/ca-notification-core.module';

@NgModule({
  declarations: [
    CaFolderCardComponent,
    CaFolderIconComponent,
    CaFolderTableComponent,
    CaFolderInlineComponent,
    CaSelectFolderDialogComponent
  ],
  exports: [
    CaFolderCardComponent,
    CaFolderIconComponent,
    CaFolderTableComponent,
    CaFolderInlineComponent,
    CaSelectFolderDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaNotificationCoreModule,
  ]
})
export class CaFolderCoreModule {
}
