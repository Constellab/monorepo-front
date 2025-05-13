import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput,
} from './component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import { CaDocument, CaDocumentBasicInfo } from '../../../ca-core/model/entities/folder/ca-document.class';
import { Observable } from 'rxjs';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  TeCompleteConfig,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
} from '@monorepo/text-editor';
import { CaConstellabDocumentHistoryService } from '../../../ca-core/service/ca-constellab-document-history.service';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';
import { CaDocumentService } from '../../../ca-core/service-api/ca-document.service';

export type CaDocumentActionEvent =
  | {
      action: 'update' | 'restoreFromTrash';
      document: CaDocument;
    }
  | CaHierarchyObjectMoveToTrashAction
  | CaHierarchyObjectMoveToFolderAction;

export class CaDocumentActionMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(
    injector: Injector,
    protected documentInfo: CaDocumentBasicInfo,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, documentInfo.id, tags);
  }

  public openDefaultActionMenu(event: MouseEvent): Observable<CaDocumentActionEvent | null> {
    const menu = this.getDefaultMenuItems(true);

    return this.generateMenu(menu, event);
  }

  protected getDefaultMenuItems(showLinks: boolean): FlMenuDynamic[] {
    const menu: FlMenuDynamic[] = [];

    if (showLinks) {
      if (this.documentInfo.isConstellabDocument) {
        menu.push({
          type: 'link',
          text: { text: 'view_document', translateText: true },
          icon: 'visibility',
          link: CaRouterService.getDocumentDetailRoute(this.documentInfo.id),
        });
      } else {
        menu.push({
          type: 'downloadLink',
          text: { text: 'download_document', translateText: true },
          icon: 'cloud_download',
          href: this.injector
            .get(CaDocumentService)
            .getDocumentDownloadUrl(this.documentInfo.id, this.documentInfo.name),
        });
      }
    }

    menu.push(this.getManageTagsButton());

    menu.push({
      type: 'button',
      text: { text: 'rename_document', translateText: true },
      icon: 'edit',
      onClick: () => this.renameDocument(),
    });
    menu.push(this.getMoveToFolderButton());
    menu.push(this.getOpenTokensButton());
    menu.push(this.getMoveToTrashButton());

    return menu;
  }

  private renameDocument(): void {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'update',
      object: { name: this.documentInfo.name },
      documentId: this.documentInfo.id,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(CaDocumentNameFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onRenameClosed(result));
  }

  private onRenameClosed(doc?: CaDocument): void {
    if (doc) {
      this.subject.next({
        action: 'update',
        document: doc,
      } as CaDocumentActionEvent);
    }
    this.subject.complete();
  }
}

export class CaDocumentActionDetailMenu extends CaDocumentActionMenu {
  private historyOverlayRef: FlOverlayRef;

  constructor(
    injector: Injector,
    documentInfo: CaDocumentBasicInfo,
    private textEditorConfig: TeCompleteConfig,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, documentInfo, tags);
  }

  public openDetailActionsMenu(event: MouseEvent): Observable<CaDocumentActionEvent | null> {
    const menu = this.getDefaultMenuItems(false);
    if (this.documentInfo.isConstellabDocument) {
      menu.unshift({
        type: 'button',
        text: { text: 'history', translateText: true },
        icon: 'history',
        onClick: () => this.toggleConstellabDocumentHistoryPanel(),
      });
    }

    return this.generateMenu(menu, event);
  }

  private toggleConstellabDocumentHistoryPanel(): void {
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    } else {
      const portalService = this.injector.get(FlPortalService);
      this.historyOverlayRef = portalService.createPortal(
        TeTextEditorHistoryPortalComponent,
        portalService.getRightSidePortalConfig(true),
        {
          service: this.injector.get(CaConstellabDocumentHistoryService),
          entityId: this.documentInfo.id,
          textEditorConfig: this.textEditorConfig,
          isEditable: true,
        } as TeTextEditorHistoryPortalData
      );
      this.historyOverlayRef.detachments().subscribe(() => {
        this.historyOverlayRef = null;
      });
    }
  }
}
