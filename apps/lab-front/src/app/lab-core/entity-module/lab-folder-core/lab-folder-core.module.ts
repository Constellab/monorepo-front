import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabCoreModule } from '../../lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabFolderSelectComponent } from './component/lab-folder-select/lab-folder-select.component';
import { LabFolderInlineComponent } from './component/lab-folder-inline/lab-folder-inline.component';
import { LabFolderSelectPortalComponent } from './component/lab-folder-select-portal/lab-folder-select-portal.component';
import { LabFolderInlineSelectComponent } from './component/lab-folder-inline-select/lab-folder-inline-select.component';

@NgModule({
  declarations: [
    LabFolderSelectComponent,
    LabFolderInlineComponent,
    LabFolderSelectPortalComponent,
    LabFolderInlineSelectComponent,
  ],
  exports: [
    LabFolderSelectComponent,
    LabFolderInlineComponent,
    LabFolderSelectPortalComponent,
    LabFolderInlineSelectComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LabCoreModule],
})
export class LabFolderCoreModule {}
