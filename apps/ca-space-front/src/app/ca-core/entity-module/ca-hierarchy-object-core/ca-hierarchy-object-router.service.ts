import { inject, Injectable } from '@angular/core';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../service/ca-router.service';
import { CaDocument } from '../../model/entities/folder/ca-document.class';
import { CaDocumentService } from '../../service-api/ca-document.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CaHierarchyObjectRouterService {
  private routerService = inject(CaRouterService);
  private documentService = inject(CaDocumentService);
  private router = inject(Router);

  public navigateToHierarchyObject(hierarchyObject: CaHierarchyObject): void {
    const route = this.getHierarchyObjectRoute(hierarchyObject);
    if (route) {
      this.routerService.navigate(route);
    }
  }

  public openHierarchyObjectInNewTab(hierarchyObject: CaHierarchyObject): void {
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
        return this.getDocumentRoute(hierarchyObject.id, hierarchyObject.name);
      case CaHierarchyObjectType.RESOURCE:
        return CaRouterService.getResourceDetailRoute(hierarchyObject.id);
    }
  }

  public navigateToDocument(hierarchyObjectId: string, hierarchyObjectName: string): void {
    const route = this.getDocumentRoute(hierarchyObjectId, hierarchyObjectName);
    if (route) {
      this.routerService.navigate(route);
    }
  }

  public getDocumentRoute(hierarchyObjectId: string, hierarchyObjectName: string): string {
    if (CaDocument.supportsPreview(hierarchyObjectName)) {
      return CaRouterService.getDocumentPreviewRoute(hierarchyObjectId);
    } else {
      const url = this.documentService.getDocumentPreviewUrl(hierarchyObjectId, hierarchyObjectName);
      window.open(url, '_blank');
      return null;
    }
  }
}
