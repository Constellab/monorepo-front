import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {CaConstellabDocument, CaDocument} from '../../../../../ca-core/model/entities/project/ca-document.class';
import {FlDebouncer} from '@monorepo/front-core-lib';
import {CaRouterService} from '../../../../../ca-core/service/ca-router.service';
import {ClRichTextI} from '@monorepo/core-lib';
import {
  CaDocumentActionEvent
} from '../../../ca-document-core/component/ca-document-actions-menu/ca-document-actions-menu.component';
import {CaDocumentTextEditorConfig2} from '../../../ca-document-core/ca-document-text-editor.config';
import {OutputData} from '@editorjs/editorjs';
import {FormControl} from '@angular/forms';

/**
 * Page to show a constellab document with the possibility to edit it.
 */
@Component({
  selector: 'ca-document-detail-page',
  templateUrl: './ca-document-detail-page.component.html',
  styleUrls: ['./ca-document-detail-page.component.scss']
})
export class CaDocumentDetailPageComponent implements OnInit, OnDestroy {

  document: CaDocument;
  contentFormControl: FormControl<ClRichTextI> = new FormControl<ClRichTextI>({disabled: true, value: null});

  textEditorConfig: CaDocumentTextEditorConfig2;

  isLoading: boolean = true;

  private contentDebouncer: FlDebouncer<OutputData>;


  constructor(private route: ActivatedRoute,
              private projectService: CaProjectService,
              private routerService: CaRouterService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.init(params.documentId)
    );

    //create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(2500);
    this.contentDebouncer.getDebouncedValue().subscribe(
      value => this.saveContent(value)
    );
  }

  private init(id: string): void {
    this.projectService.getConstellabDocument(id).subscribe({
      next: doc => this.getDocumentSuccess(doc),
      error: () => this.isLoading = false
    });
  }

  private getDocumentSuccess(constellabDocument: CaConstellabDocument): void {
    this.document = constellabDocument.document;
    this.contentFormControl.patchValue( constellabDocument.content);
    this.textEditorConfig = new CaDocumentTextEditorConfig2(constellabDocument.document.id,
      this.projectService);
    this.isLoading = false;
  }

  onContentUpdate(content: OutputData): void {
    this.contentDebouncer.setValue(content);
  }

  private saveContent(content: OutputData): void {
    this.projectService.updateConstellabDocument(this.document.id, content).subscribe(
      doc => this.document = doc.document
    );
  }

  onDocumentAction(event: CaDocumentActionEvent): void {
    if (event.action === 'update') {
      this.document = event.document;
    } else if (event.action === 'delete') {
      this.routerService.navigateToProjectDetail(this.document.projectId);
    }
  }

  toggleEditMode(): void {
    if (this.contentFormControl.disabled) {
      this.contentFormControl.enable();
    } else {
      this.contentFormControl.disable();
    }
  }

  print(): void {
    if (window) {
      window.print();
    }
  }

  ngOnDestroy(): void {
    this.contentDebouncer?.markForComplete();
  }

  protected readonly focus = focus;
}
