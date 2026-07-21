import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, map, Observable } from 'rxjs';

import {
  CaHierarchyObjectSimple,
  CaHierarchyObjectType,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import {
  CaHierarchyObjectContext,
  CaHierarchyObjectDetailState,
} from '../../state/ca-hierarchy-object-detail.state';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconButton, MatTooltip, MatIcon, RouterLink, AsyncPipe, TranslatePipe],
})
export class CaHierarchyObjectBreadcrumbComponent implements OnInit {
  private state = inject(CaHierarchyObjectDetailState);
  private translateService = inject(FlTranslateService);

  links$: Observable<CaBreadcrumbLink[]>;

  ngOnInit(): void {
    // read children route params
    this.links$ = combineLatest([this.state.getAncestorsFolders$(), this.state.getHierarchyContext$()]).pipe(
      map(([ancestors, currentObject]) => this.ancestorsToLinks(ancestors, currentObject))
    );
  }

  private ancestorsToLinks(
    ancestors: CaHierarchyObjectSimple[],
    hierarchyContext: CaHierarchyObjectContext
  ): CaBreadcrumbLink[] {
    const links: CaBreadcrumbLink[] = [];

    if (ancestors?.length > 0) {
      for (const ancestor of ancestors) {
        links.unshift({
          id: ancestor.id,
          title: ancestor.name,
          url: this.getAncestorLink(ancestor.objectType, ancestor.id),
        });
      }

      if (hierarchyContext.hierarchyObject && hierarchyContext.hierarchyObject.id !== ancestors[0].id) {
        links.push({
          id: hierarchyContext.hierarchyObject.id,
          title: hierarchyContext.hierarchyObject.name,
          url: this.getAncestorLink(
            hierarchyContext.hierarchyObject.objectType,
            hierarchyContext.hierarchyObject.id
          ),
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

  private getAncestorLink(objectType: CaHierarchyObjectType, id: string): string {
    switch (objectType) {
      case CaHierarchyObjectType.FOLDER:
        return CaRouterService.getFolderDetailRoute(id);
      case CaHierarchyObjectType.SCENARIO:
        return CaRouterService.getScenarioDetailRoute(id);
      case CaHierarchyObjectType.NOTE:
        return CaRouterService.getNoteDetailRoute(id);
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        return CaRouterService.getDocumentDetailRoute(id);
      case CaHierarchyObjectType.DOCUMENT:
        return CaRouterService.getDocumentPreviewRoute(id);
      case CaHierarchyObjectType.RESOURCE:
      case CaHierarchyObjectType.APPLICATION:
        return CaRouterService.getResourceDetailRoute(id);
    }
  }

  toggleTree(): void {
    this.state.toggleTree();
  }
}
