import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes, UrlTree } from '@angular/router';

import { Observable, of } from 'rxjs';
import { LabViewConfigService } from '../lab-core/entity-service/lab-view-config.service';
import { catchError, map } from 'rxjs/operators';
import { LabRouterService } from '../lab-core/service/lab-router.service';

@Injectable({
  providedIn: 'root',
})
export class LabViewRouteRedirectGuard {
  private viewConfigService = inject(LabViewConfigService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const viewId = route.params.id;

    if (!viewId) {
      return this.router.createUrlTree([LabRouterService.getDataboxRoute()]);
    }

    return this.viewConfigService.getById(viewId).pipe(
      map((viewConfig) => {
        const route = LabRouterService.getViewConfigDetailRoute(viewConfig.resource.id, viewConfig.id);
        return this.router.createUrlTree([route.route], { queryParams: route.queryParams });
      }),
      catchError(() => of(this.router.createUrlTree([LabRouterService.getDataboxRoute()])))
    );
  }
}

export const labResourceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lab-resource-search-page/lab-resource-search-page/lab-resource-search-page.component').then(
        (m) => m.LabResourceSearchPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./lab-resource-detail-page/lab-resource-detail-page/lab-resource-detail-page.component').then(
        (m) => m.LabResourceDetailPageComponent
      ),
  },
  // special route to redirect to the view config page in the resource detail page,
  // there might be a better way to do this
  {
    path: 'view-redirect/:id',
    canActivate: [LabViewRouteRedirectGuard],
    loadComponent: () =>
      import('./lab-resource-search-page/lab-resource-search-page/lab-resource-search-page.component').then(
        (m) => m.LabResourceSearchPageComponent
      ),
  },
];
