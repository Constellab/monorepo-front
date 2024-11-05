import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaDocumentDetailPageComponent } from './component/ca-document-detail-page/ca-document-detail-page.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaDocumentCoreModule } from '../ca-document-core/ca-document-core.module';
import { CaDocumentPreviewPageComponent } from './component/ca-document-preview-page/ca-document-preview-page.component';

@NgModule({
  declarations: [CaDocumentDetailPageComponent, CaDocumentPreviewPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaFolderHierarchyCoreModule,
    CaDocumentCoreModule,
  ],
})
export class CaDocumentDetailPageModule {}
