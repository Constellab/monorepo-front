import { inject, Injectable, Injector } from '@angular/core';
import { CaHierarchyObjectDetailState } from './ca-hierarchy-object-detail.state';
import { CaHierarchyObjectEventState } from './ca-hierarchy-object-event.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaHierarchyObjectActionEvent,
  CaHierarchyObjectActionMenu,
} from '../../ca-folder-detail-page/ca-hierarchy-object-action-menu';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaDocument } from '../../../../ca-core/model/entities/folder/ca-document.class';
import { Router } from '@angular/router';
import { CaFolderRightPanelState } from '../../ca-folder-detail-page/state/ca-folder-right-panel.state';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';

@Injectable()
export class CaHierarchyObjectActionsMenuState {
  private hierarchyObjectState = inject(CaHierarchyObjectDetailState);
  private injector = inject(Injector);
  private eventState = inject(CaHierarchyObjectEventState);

  private router = inject(Router);
  private routerService = inject(CaRouterService);
  private rightPanelState = inject(CaFolderRightPanelState);
  private folderService = inject(CaFolderService);

  public openHierarchyObjectActionMenu(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    const service = new CaHierarchyObjectActionMenu(this.injector, hierarchyObject, {
      availableTags: this.hierarchyObjectState.getChildrenAvailableTags(),
    });
    service
      .openActionMenu(event)
      .subscribe((hierarchyObjectActionEvent) =>
        this.onHierarchyObjectActionMenuEvent(hierarchyObjectActionEvent)
      );
  }

  private onHierarchyObjectActionMenuEvent(event: CaHierarchyObjectActionEvent): void {
    if (!event) return;
    this.eventState.hierarchyObjectActionEvent(event);
  }

  public hierarchyObjectHasActionMenu(hierarchyObject: CaHierarchyObject): boolean {
    return [
      CaHierarchyObjectType.FOLDER,
      CaHierarchyObjectType.DOCUMENT,
      CaHierarchyObjectType.CONSTELLAB_DOCUMENT,
      CaHierarchyObjectType.RESOURCE,
      CaHierarchyObjectType.NOTE,
      CaHierarchyObjectType.SCENARIO,
    ].includes(hierarchyObject.objectType);
  }

  public onHierarchyObjectClicked(hierarchyObject: CaHierarchyObject): void {
    switch (hierarchyObject.objectType) {
      case CaHierarchyObjectType.FOLDER:
        this.routerService.navigateToFolderDetail(hierarchyObject.id);
        break;
      case CaHierarchyObjectType.NOTE:
        this.rightPanelState.updateRightPanelState({
          type: 'note',
          objectId: hierarchyObject.id,
        });
        break;
      case CaHierarchyObjectType.SCENARIO:
      case CaHierarchyObjectType.RESOURCE:
        // no preview for scenario, nor resource
        this.onHierarchyObjectDblClicked(hierarchyObject);
        break;
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        this.rightPanelState.updateRightPanelState({
          type: 'constellab-document',
          objectId: hierarchyObject.id,
        });
        break;
      case CaHierarchyObjectType.DOCUMENT:
        const route = this.getDocumentRoute(hierarchyObject);
        if (route) {
          this.routerService.navigate(route);
        }
        break;
    }
  }

  public onHierarchyObjectDblClicked(hierarchyObject: CaHierarchyObject): void {
    const route = this.getObjectRoute(hierarchyObject);
    if (route) {
      this.routerService.navigate(route);
    }
  }

  public onHierarchyObjectMiddleClicked(hierarchyObject: CaHierarchyObject): void {
    const route = this.getObjectRoute(hierarchyObject);
    if (route) {
      const url = this.router.createUrlTree([route]).toString();
      window.open(url, '_blank');
    }
  }

  private getObjectRoute(hierarchyObject: CaHierarchyObject): string {
    switch (hierarchyObject.objectType) {
      case CaHierarchyObjectType.FOLDER:
        return CaRouterService.getFolderDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.NOTE:
        return CaRouterService.getNoteDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.SCENARIO:
        return CaRouterService.getScenarioDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        return CaRouterService.getDocumentDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.DOCUMENT:
        return this.getDocumentRoute(hierarchyObject);
      case CaHierarchyObjectType.RESOURCE:
        return CaRouterService.getResourceDetailRoute(hierarchyObject.id);
    }
  }

  private getDocumentRoute(hierarchyObject: CaHierarchyObject): string {
    if (CaDocument.supportsPreview(hierarchyObject.name)) {
      return CaRouterService.getDocumentPreviewRoute(hierarchyObject.id);
    } else {
      const url = this.folderService.getDocumentPreviewUrl(hierarchyObject.id, hierarchyObject.name);
      window.open(url, '_blank');
      return null;
    }
  }
}
