import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { CaHierarchyObjectDetailState } from '../../state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectType
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

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
  styleUrls: ['./ca-hierarchy-object-breadcrumb.component.scss']
})
export class CaHierarchyObjectBreadcrumbComponent implements OnInit {

  links$: Observable<BreadcrumbLink[]>;

  constructor(private state: CaHierarchyObjectDetailState,
              private translateService: FlTranslateService) {
  }

  ngOnInit(): void {
    // read children route params
    this.links$ = this.state.getAncestorsFolders$().pipe(
      map(ancestors => this.ancestorsToLinks(ancestors))
    );
  }

  private ancestorsToLinks(ancestors: CaHierarchyObject[]): BreadcrumbLink[] {
    const links: BreadcrumbLink[] = [];

    for (const ancestor of ancestors) {
      links.unshift({
        id: ancestor.id,
        title: ancestor.name,
        url: this.getAncestorLink(ancestor)
      });
    }

    // add the dashboard link
    links.unshift({
      id: '1',
      title: this.translateService.translate('dashboard'),
      url: CaRouterService.getDashboardRoute()
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
      case CaHierarchyObjectType.DOCUMENT:
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        return CaRouterService.getDocumentDetailRoute(ancestor.id);
    }
  }

  toggleTree(): void {
    this.state.toggleTree();
  }

}
