import { Component, Input, OnInit } from '@angular/core';
import { CaConstellabDocument } from '../../../../../ca-core/model/entities/project/ca-document.class';
import { Observable } from 'rxjs';
import { CaProjectService } from '../../../../../ca-core/service-api/ca-project.service';
import { CaDocumentTextEditorConfig } from '../../../ca-document-core/ca-document-text-editor.config';

@Component({
  selector: 'ca-constellab-document-preview',
  templateUrl: './ca-constellab-document-preview.component.html',
  styleUrl: './ca-constellab-document-preview.component.scss'
})
export class CaConstellabDocumentPreviewComponent implements OnInit {

  @Input() documentId: string;

  document$: Observable<CaConstellabDocument>;

  textEditorConfig: CaDocumentTextEditorConfig;

  constructor(private projectService: CaProjectService) {
  }

  ngOnInit(): void {
    this.textEditorConfig = new CaDocumentTextEditorConfig(this.documentId,
      this.projectService);
    this.document$ = this.projectService.getConstellabDocument(this.documentId);
  }
}
