import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ClHelpService } from '@monorepo/core-lib';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';

import {
  CaConstellabDocument,
  CaDocument,
} from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaRootFolderUserRoleObj } from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import {
  CaHierarchyObjectTagDatasource,
  CaHierarchyObjectType,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaConstellabDocumentService } from '../../../../../ca-core/service-api/ca-constellab-document.service';
import { CaDocumentService } from '../../../../../ca-core/service-api/ca-document.service';
import { CaDetailCardComponent } from '../../../ca-folder-hierarchy-core/component/ca-detail-card/ca-detail-card.component';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import { CaConstellabDocumentTextEditorConfig } from '../../ca-constellab-document-text-editor.config';
import { CaDocumentActionDetailMenu, CaDocumentActionEvent } from '../../ca-document-action-menu';

/**
 * Component to show the detail of a constellab document.
 * It can be used in the main app or in public pages so it should not use states.
 */
@Component({
  selector: 'ca-constellab-document-detail',
  imports: [
    CaDetailCardComponent,
    FlFormModule,
    FlSectionModule,
    FlTagModule,
    FlUserModule,
    MatButton,
    MatIcon,
    MatIconButton,
    TeTextEditorModule,
    TranslatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './ca-constellab-document-detail.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-constellab-document-detail.component.scss',
})
export class CaConstellabDocumentDetailComponent {
  documentId = input.required<string>();
  userRole = input.required<CaRootFolderUserRoleObj>();
  hierarchyObjectToken = input<string>();

  tags = input<CaHierarchyObjectTagDatasource>();

  documentAction = output<CaDocumentActionEvent>();

  private snackBarService = inject(FlSnackBarService);
  private injector = inject(Injector);
  private documentService = inject(CaDocumentService);
  private constellabDocumentService = inject(CaConstellabDocumentService);
  private eventState = inject(CaHierarchyObjectEventState, { optional: true });

  canEdit = computed(() => this.userRole().canEdit());

  document: CaDocument;

  getIsLoading: boolean = true;

  textEditorConfig: CaConstellabDocumentTextEditorConfig;
  contentFormControl: FormControl<TeRichText> = new FormControl({ disabled: true, value: null });
  saveDescriptionFunc: (value: TeRichText) => Observable<CaConstellabDocument>;

  constructor() {
    effect(() => this.init(this.documentId()));
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
      this.constellabDocumentService,
      this.hierarchyObjectToken()
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

  async openDocumentActionMenu(document: CaDocument, event: MouseEvent): Promise<void> {
    ClHelpService.stopEventPropagation(event);
    const documentActionMenu = new CaDocumentActionDetailMenu(
      this.injector,
      {
        id: document.id,
        name: document.name,
        isConstellabDocument: document.isConstellabDocument(),
        userRole: this.userRole(),
      },
      this.textEditorConfig,
      { tags: this.tags() }
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
    }
    if (this.eventState) {
      this.eventState.emitDocumentEvent(event);
    }
  }

  toggleEditMode(): void {
    if (this.contentFormControl.disabled) {
      this.contentFormControl.enable();
      this.constellabDocumentService.checkEditConstellabDocument(this.document.id).subscribe({
        error: () => this.contentFormControl.disable(),
      });
    } else {
      this.contentFormControl.disable();
    }
  }

  print(): void {
    if (window) {
      window.print();
    }
  }

  renameDocument(newTitle: string): void {
    this.documentService.renameDocument(this.document.id, newTitle).subscribe();
    if (this.eventState) {
      this.eventState.emitRenameEvent(this.document.id, CaHierarchyObjectType.CONSTELLAB_DOCUMENT, newTitle);
    }
  }
}
