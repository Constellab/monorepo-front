import { Component, inject, Injector, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, switchMap, tap } from 'rxjs';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/fl-form';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/fl-section/fl-section.module';
import { FlTagModule } from '../../../../../../../../../libs/front-core-lib/src/lib/fl-tag/fl-tag.module';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import {
  CaDocument,
  CaDocumentPreviewDTO,
} from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaRootFolderUserRoleObj } from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import {
  CaHierarchyObjectTagDatasource,
  CaHierarchyObjectType,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaDocumentService } from '../../../../../ca-core/service-api/ca-document.service';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import { CaDocumentActionDetailMenu, CaDocumentActionEvent } from '../../ca-document-action-menu';

@Component({
  selector: 'ca-document-preview',
  imports: [
    FlSectionModule,
    CaHierarchyObjectIconComponent,
    FlFormModule,
    MatButtonModule,
    MatIconModule,
    FlTagModule,
  ],
  templateUrl: './ca-document-preview.component.html',
  styleUrl: './ca-document-preview.component.scss',
})
export class CaDocumentPreviewComponent {
  documentId = input.required<string>();
  userRole = input.required<CaRootFolderUserRoleObj>();
  hierarchyObjectToken = input<string>();

  tags = input<CaHierarchyObjectTagDatasource>();

  private documentService = inject(CaDocumentService);
  private sanitizer = inject(DomSanitizer);
  private eventState = inject(CaHierarchyObjectEventState, { optional: true });
  private injector = inject(Injector);

  documentPreviewUrl: SafeUrl;

  documentPreview$: Observable<CaDocumentPreviewDTO> = toObservable(this.documentId).pipe(
    switchMap((id) => this.documentService.generateDocumentPreview(id)),
    tap(
      (preview) =>
        (this.documentPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(preview.previewUrl))
    )
  );

  openMenu(document: CaDocument, event: MouseEvent): void {
    const documentMenu = new CaDocumentActionDetailMenu(
      this.injector,
      {
        id: document.id,
        name: document.name,
        userRole: this.userRole(),
        isConstellabDocument: document.isConstellabDocument(),
      },
      null,
      { tags: this.tags() },
      this.hierarchyObjectToken()
    );

    documentMenu.openDetailActionsMenu(event).subscribe((event) => this.onDocumentEvent(event));
  }

  private onDocumentEvent(event: CaDocumentActionEvent): void {
    if (this.eventState) {
      this.eventState.emitDocumentEvent(event);
    }
  }

  renameDocument(document: CaDocument, name: string): void {
    this.documentService.renameDocument(document.id, name).subscribe();
    if (this.eventState) {
      this.eventState.emitRenameEvent(document.id, CaHierarchyObjectType.DOCUMENT, name);
    }
  }
}
