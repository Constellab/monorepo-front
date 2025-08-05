import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaConstellabDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaDetailRoutePipe } from '../../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaConstellabDocumentService } from '../../../../../ca-core/service-api/ca-constellab-document.service';
import { CaConstellabDocumentTextEditorConfig } from '../../../ca-document-core/ca-constellab-document-text-editor.config';

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
  private constellabDocumentService = inject(CaConstellabDocumentService);

  @Input() documentId: string;

  document$: Observable<CaConstellabDocument>;

  textEditorConfig: CaConstellabDocumentTextEditorConfig;

  ngOnInit(): void {
    this.textEditorConfig = new CaConstellabDocumentTextEditorConfig(
      this.documentId,
      this.constellabDocumentService
    );
    this.document$ = this.constellabDocumentService.getConstellabDocument(this.documentId);
  }
}
