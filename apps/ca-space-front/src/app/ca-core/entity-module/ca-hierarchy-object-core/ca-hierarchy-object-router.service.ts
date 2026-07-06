import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../service/ca-router.service';
import { CaResourceService } from '../../service-api/ca-resource.service';

@Injectable({ providedIn: 'root' })
export class CaHierarchyObjectRouterService {
  private routerService = inject(CaRouterService);
  private resourceService = inject(CaResourceService);
  private router = inject(Router);

  public navigateToHierarchyObject(hierarchyObject: CaHierarchyObject): void {
    // applications redirect to their access url in a new tab instead of a detail page
    if (this.isApplication(hierarchyObject)) {
      window.open(this.resourceService.getRedirectUrl(hierarchyObject.id), '_blank');
      return;
    }

    const route = this.getHierarchyObjectRoute(hierarchyObject);
    if (route) {
      this.routerService.navigate(route);
    }
  }

  public openHierarchyObjectInNewTab(hierarchyObject: CaHierarchyObject): void {
    // applications redirect to their access url instead of a detail page
    if (this.isApplication(hierarchyObject)) {
      window.open(this.resourceService.getRedirectUrl(hierarchyObject.id), '_blank');
      return;
    }

    const route = this.getHierarchyObjectRoute(hierarchyObject);
    if (route) {
      const url = this.router.createUrlTree([route]).toString();
      window.open(url, '_blank');
    }
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
