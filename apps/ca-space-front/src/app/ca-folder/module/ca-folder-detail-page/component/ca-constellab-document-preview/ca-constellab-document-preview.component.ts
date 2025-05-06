import { Component, inject, Input, OnInit } from '@angular/core';
import { CaConstellabDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { Observable } from 'rxjs';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaDocumentTextEditorConfig } from '../../../ca-document-core/ca-document-text-editor.config';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaDetailRoutePipe } from '../../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';

@Component({
  selector: 'ca-constellab-document-preview',
  templateUrl: './ca-constellab-document-preview.component.html',
  styleUrl: './ca-constellab-document-preview.component.scss',
  imports: [
    FlSectionModule,
    CdkScrollable,
    CaHierarchyObjectIconComponent,
    MatAnchor,
    RouterLink,
    TeTextEditorModule,
    ReactiveFormsModule,
    FormsModule,
    CaDetailRoutePipe,
    TranslatePipe,
    FlPortalModule,
  ],
})
export class CaConstellabDocumentPreviewComponent implements OnInit {
  private folderService = inject(CaFolderService);

  @Input() documentId: string;

  document$: Observable<CaConstellabDocument>;

  textEditorConfig: CaDocumentTextEditorConfig;

  ngOnInit(): void {
    this.textEditorConfig = new CaDocumentTextEditorConfig(this.documentId, this.folderService);
    this.document$ = this.folderService.getConstellabDocument(this.documentId);
  }
}
