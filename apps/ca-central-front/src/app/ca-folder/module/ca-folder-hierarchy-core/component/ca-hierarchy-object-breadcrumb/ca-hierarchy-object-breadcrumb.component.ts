import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { CaHierarchyObjectDetailState } from '../../state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectSimple,
  CaHierarchyObjectType,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

interface CaBreadcrumbLink {
  id: string;
  title: string;
  url: string;
}

/**
 * Breadcrumb for hierarchy, note and scenarios
 * It gets the hierarchy from the api
 */
@Component({
  selector: 'ca-hierarchy-object-breadcrumb',
  templateUrl: './ca-hierarchy-object-breadcrumb.component.html',
  styleUrls: ['./ca-hierarchy-object-breadcrumb.component.scss'],
  imports: [MatIconButton, MatTooltip, MatIcon, RouterLink, AsyncPipe, TranslatePipe],
})
export class CaHierarchyObjectBreadcrumbComponent implements OnInit {
  private state = inject(CaHierarchyObjectDetailState);
  private translateService = inject(FlTranslateService);

  links$: Observable<CaBreadcrumbLink[]>;

  ngOnInit(): void {
    // read children route params
    this.links$ = combineLatest([this.state.getAncestorsFolders$(), this.state.getHierarchyObject$()]).pipe(
      map(([ancestors, currentObject]) => this.ancestorsToLinks(ancestors, currentObject))
    );
  }

  private ancestorsToLinks(
    ancestors: CaHierarchyObjectSimple[],
    currentObject: CaHierarchyObject
  ): CaBreadcrumbLink[] {
    const links: CaBreadcrumbLink[] = [];

    if (ancestors?.length > 0) {
      for (const ancestor of ancestors) {
        links.unshift({
          id: ancestor.id,
          title: ancestor.name,
          url: this.getAncestorLink(ancestor),
        });
      }

      if (currentObject && currentObject.id !== ancestors[0].id) {
        links.push({
          id: currentObject.id,
          title: currentObject.name,
          url: this.getAncestorLink(currentObject),
        });
      }
    }

    links.unshift(this.getDefaultLinks());

    return links;
  }

  private getDefaultLinks(): CaBreadcrumbLink {
    return {
      id: '1',
      title: this.translateService.translate('my_folders'),
      url: CaRouterService.getMyFoldersRoute(),
    };
  }

  private getAncestorLink(ancestor: CaHierarchyObjectSimple): string {
    switch (ancestor.objectType) {
      case CaHierarchyObjectType.FOLDER:
        return CaRouterService.getFolderDetailRoute(ancestor.id);
      case CaHierarchyObjectType.SCENARIO:
        return CaRouterService.getScenarioDetailRoute(ancestor.id);
      case CaHierarchyObjectType.NOTE:
        return CaRouterService.getNoteDetailRoute(ancestor.id);
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        return CaRouterService.getDocumentDetailRoute(ancestor.id);
      case CaHierarchyObjectType.DOCUMENT:
        return CaRouterService.getDocumentPreviewRoute(ancestor.id);
      case CaHierarchyObjectType.RESOURCE:
        return CaRouterService.getResourceDetailRoute(ancestor.id);
    }
  }

  toggleTree(): void {
    this.state.toggleTree();
  }
}
