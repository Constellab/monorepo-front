import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../service/ca-router.service';

@Injectable({ providedIn: 'root' })
export class CaHierarchyObjectRouterService {
  private routerService = inject(CaRouterService);
  private router = inject(Router);

  public navigateToHierarchyObject(hierarchyObject: CaHierarchyObject): void {
    // Applications open the light resource-redirect page in a NEW tab. That page fetches the access
    // url via XHR (proper auth/space context) and redirects itself to the app — so the app ends up
    // in the new tab and the current page stays put.
    if (this.isApplication(hierarchyObject)) {
      this.openApplicationInNewTab(hierarchyObject);
      return;
    }

    const route = this.getHierarchyObjectRoute(hierarchyObject);
    if (route) {
      this.routerService.navigate(route);
    }
  }

  public openHierarchyObjectInNewTab(hierarchyObject: CaHierarchyObject): void {
    // Applications go through the light resource-redirect page (see navigateToHierarchyObject).
    if (this.isApplication(hierarchyObject)) {
      this.openApplicationInNewTab(hierarchyObject);
      return;
    }

    const route = this.getHierarchyObjectRoute(hierarchyObject);
    if (route) {
      const url = this.router.createUrlTree([route]).toString();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  private openApplicationInNewTab(hierarchyObject: CaHierarchyObject): void {
    window.open(
      CaRouterService.getResourceRedirectRoute(hierarchyObject.id),
      '_blank',
      'noopener,noreferrer'
    );
  }

  public getHierarchyObjectRoute(hierarchyObject: CaHierarchyObject): string {
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
        return CaRouterService.getDocumentPreviewRoute(hierarchyObject.id);
      case CaHierarchyObjectType.RESOURCE:
      case CaHierarchyObjectType.APPLICATION:
        return CaRouterService.getResourceDetailRoute(hierarchyObject.id);
    }
  }

  private isApplication(hierarchyObject: CaHierarchyObject): boolean {
    return hierarchyObject.objectType === CaHierarchyObjectType.APPLICATION;
  }
}
