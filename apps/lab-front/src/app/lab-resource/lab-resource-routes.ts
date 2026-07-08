import { inject,Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes, UrlTree } from '@angular/router';
import { LiRouterService, LiViewConfigService } from '@monorepo/lab-lib/li-core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LabViewRouteRedirectGuard {
  private viewConfigService = inject(LiViewConfigService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const viewId = route.params.id;

    if (!viewId) {
      return this.router.createUrlTree([LiRouterService.getDataboxRoute()]);
    }

    return this.viewConfigService.getById(viewId).pipe(
      map((viewConfig) => {
        const route = LiRouterService.getViewConfigDetailRoute(viewConfig.resource.id, viewConfig.id);
        return this.router.createUrlTree([route.route], { queryParams: route.queryParams });
      }),
      catchError(() => of(this.router.createUrlTree([LiRouterService.getDataboxRoute()])))
    );
  }
}

export const LAB_RESOURCE_ROUTES: Routes = [
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
