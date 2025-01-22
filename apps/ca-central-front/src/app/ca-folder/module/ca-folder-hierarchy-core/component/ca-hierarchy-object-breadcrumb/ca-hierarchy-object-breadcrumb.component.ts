import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { CaHierarchyObjectDetailState } from '../../state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

interface BreadcrumbLink {
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

  links$: Observable<BreadcrumbLink[]>;

  hasChildren$: Observable<boolean> = this.state.hasSubFolders$();

  ngOnInit(): void {
    // read children route params
    this.links$ = this.state
      .getAncestorsFolders$()
      .pipe(map((ancestors) => this.ancestorsToLinks(ancestors)));
  }

  private ancestorsToLinks(ancestors: CaHierarchyObject[]): BreadcrumbLink[] {
    const links: BreadcrumbLink[] = [];

    for (const ancestor of ancestors) {
      links.unshift({
        id: ancestor.id,
        title: ancestor.name,
        url: this.getAncestorLink(ancestor),
      });
    }

    // add the dashboard link
    links.unshift({
      id: '1',
      title: this.translateService.translate('home'),
      url: CaRouterService.getHomeRoute(),
    });

    return links;
  }

  private getAncestorLink(ancestor: CaHierarchyObject): string {
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
