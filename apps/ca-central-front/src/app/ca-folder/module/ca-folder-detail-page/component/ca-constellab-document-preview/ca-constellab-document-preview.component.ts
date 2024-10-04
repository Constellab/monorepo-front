import { Component, Input, OnInit } from '@angular/core';
import { CaConstellabDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { Observable } from 'rxjs';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaDocumentTextEditorConfig } from '../../../ca-document-core/ca-document-text-editor.config';
import { CaHierarchyObjectType } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

@Component({
  selector: 'ca-constellab-document-preview',
  templateUrl: './ca-constellab-document-preview.component.html',
  styleUrl: './ca-constellab-document-preview.component.scss'
})
export class CaConstellabDocumentPreviewComponent implements OnInit {

  @Input() documentId: string;

  document$: Observable<CaConstellabDocument>;

  textEditorConfig: CaDocumentTextEditorConfig;

  constellabDocument = CaHierarchyObjectType.CONSTELLAB_DOCUMENT;

  constructor(private folderService: CaFolderService) {
  }

  ngOnInit(): void {
    this.textEditorConfig = new CaDocumentTextEditorConfig(this.documentId,
      this.folderService);
    this.document$ = this.folderService.getConstellabDocument(this.documentId);
  }
}
