import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { CaCurrentSpaceService } from '../service-api/ca-current-space.service';
import { CaEnvironmentHelper } from '../utils/ca-environment.helper';

/**
 * Only for local environment, add the space domain to the request
 */
@Injectable({ providedIn: 'root' })
export class CaSpaceInterceptor implements HttpInterceptor {
  private currentSpaceService = inject(CaCurrentSpaceService);
  private coCommunityHelper = inject(CoCommunityHelperService);
  private apiService = inject(FlApiService);

  private readonly spaceHeader = 'local-space';
  private readonly hierarchyObjectTokenHeaderKey = 'cn-hierarchy-object-token';
  private hierarchyObjectTokenHeader: string | null = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If request is for community API, do not add space header
    if (req.url.includes(this.coCommunityHelper.getCommunityApiUrl())) {
      return next.handle(req);
    }

    const currentSpaceDomainDev = this.currentSpaceService.getCurrentSpaceDomainDev();
    if (!CaEnvironmentHelper.isProduction() && currentSpaceDomainDev != null) {
      req = req.clone({
        headers: req.headers.set(this.spaceHeader, currentSpaceDomainDev),
      });
    }

    // If hierarchy object token is set, add it to the request headers
    if (this.hierarchyObjectTokenHeader && this.apiService.isApiUrl(req.url)) {
      req = req.clone({
        headers: req.headers.set(this.hierarchyObjectTokenHeaderKey, this.hierarchyObjectTokenHeader),
      });
    }
    return next.handle(req);
  }

  // TODO TO IMPROVE
  public setHierarchyObjectToken(token: string): void {
    this.hierarchyObjectTokenHeader = token;
  }

  public clearHierarchyObjectToken(): void {
    this.hierarchyObjectTokenHeader = null;
  }
}
