import { Component, inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CaConstellabDocument,
  CaDocument,
} from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { CaConstellabDocumentTextEditorConfig } from '../../../ca-document-core/ca-constellab-document-text-editor.config';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { ClHelpService } from '@monorepo/core-lib';
import {
  CaDocumentActionDetailMenu,
  CaDocumentActionEvent,
} from '../../../ca-document-core/ca-document-action-menu';
import { Observable, tap } from 'rxjs';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CaHierarchyObjectBreadcrumbComponent } from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { CaDocumentService } from '../../../../../ca-core/service-api/ca-document.service';
import { CaConstellabDocumentService } from '../../../../../ca-core/service-api/ca-constellab-document.service';

/**
 * Page to show a constellab document with the possibility to edit it.
 */
@Component({
  selector: 'ca-constellab-document-detail-page',
  templateUrl: './ca-constellab-document-detail-page.component.html',
  styleUrls: ['./ca-constellab-document-detail-page.component.scss'],
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    FlSectionModule,
    FlFormModule,
    FlCardModule,
    MatButton,
    MatIcon,
    MatIconButton,
    FlUserModule,
    TeTextEditorModule,
    ReactiveFormsModule,
    NgClass,
    TranslatePipe,
    FlTagModule,
  ],
})
export class CaConstellabDocumentDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private state = inject(CaHierarchyObjectDetailState);
  private snackBarService = inject(FlSnackBarService);
  private injector = inject(Injector);
  private documentService = inject(CaDocumentService);
  private constellabDocumentService = inject(CaConstellabDocumentService);

  document: CaDocument;

  getIsLoading: boolean = true;

  textEditorConfig: CaConstellabDocumentTextEditorConfig;
  contentFormControl: FormControl<TeRichText> = new FormControl({ disabled: true, value: null });
  saveDescriptionFunc: (value: TeRichText) => Observable<CaConstellabDocument>;

  tags = this.state.getTags();

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params.id));
  }

  private init(id: string): void {
    this.constellabDocumentService.getConstellabDocument(id).subscribe({
      next: (doc) => this.getDocumentSuccess(doc),
      error: () => (this.getIsLoading = false),
    });
  }

  private getDocumentSuccess(constellabDocument: CaConstellabDocument): void {
    this.document = constellabDocument.document;
    this.contentFormControl.patchValue(constellabDocument.content, { emitEvent: false });
    this.textEditorConfig = new CaConstellabDocumentTextEditorConfig(
      constellabDocument.document.id,
      this.constellabDocumentService
    );
    this.getIsLoading = false;

    this.saveDescriptionFunc = (value: TeRichText) =>
      this.constellabDocumentService.updateConstellabDocument(this.document.id, value).pipe(
        tap({
          next: (doc) => this.saveContentSuccess(doc),
          error: (error) => this.onError(error),
        })
      );
  }

  private saveContentSuccess(document: CaConstellabDocument): void {
    this.document = document.document;
  }

  private onError(error: FlServerError): void {
    // don't show unknown server error
    if (error?.nestedError?.code !== 'error.server_error') {
      this.snackBarService.openErrorMessage({ text: error.message, translateText: false });
    }
  }

  openDocumentActionMenu(document: CaDocument, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const documentActionMenu = new CaDocumentActionDetailMenu(
      this.injector,
      document.basicInfo,
      this.textEditorConfig,
      { tags: this.state.getTags() }
    );

    documentActionMenu.openDetailActionsMenu(event).subscribe((event) => {
      this.onDocumentAction(event);
    });
  }

  private onDocumentAction(event: CaDocumentActionEvent): void {
    switch (event.action) {
      case 'update':
        this.document = event.document;
        break;
      case 'moveToTrash':
        this.state.navigateToParentFolder();
        break;
    }
  }

  toggleEditMode(): void {
    if (this.contentFormControl.disabled) {
      // use emitFalse to avoid the value change event
      this.contentFormControl.enable({ emitEvent: false });
      this.constellabDocumentService.checkEditConstellabDocument(this.document.id).subscribe({
        error: () => this.contentFormControl.disable({ emitEvent: false }),
      });
    } else {
      this.contentFormControl.disable({ emitEvent: false });
    }
  }

  print(): void {
    if (window) {
      window.print();
    }
  }

  renameDocument(newTitle: string): void {
    this.documentService.renameDocument(this.document.id, newTitle).subscribe();
  }
}
