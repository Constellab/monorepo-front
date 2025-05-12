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
import { CaFolderRightPanelState } from '../../ca-folder-detail-page/state/ca-folder-right-panel.state';
import { CaHierarchyObjectRouterService } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-router.service';

@Injectable()
export class CaHierarchyObjectActionsMenuState {
  private hierarchyObjectState = inject(CaHierarchyObjectDetailState);
  private injector = inject(Injector);
  private eventState = inject(CaHierarchyObjectEventState);

  private routerService = inject(CaRouterService);
  private rightPanelState = inject(CaFolderRightPanelState);
  private hierarchyObjectRouter = inject(CaHierarchyObjectRouterService);

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
        this.hierarchyObjectRouter.navigateToDocument(hierarchyObject);
        break;
    }
  }

  public onHierarchyObjectDblClicked(hierarchyObject: CaHierarchyObject): void {
    this.hierarchyObjectRouter.navigateToHierarchyObject(hierarchyObject);
  }

  public onHierarchyObjectMiddleClicked(hierarchyObject: CaHierarchyObject): void {
    this.hierarchyObjectRouter.openHierarchyObjectInNewTab(hierarchyObject);
  }
}
