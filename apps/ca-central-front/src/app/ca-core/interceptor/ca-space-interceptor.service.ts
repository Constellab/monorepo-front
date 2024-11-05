import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CaCurrentSpaceService } from '../service-api/ca-current-space.service';
import { CaEnvironmentHelper } from '../utils/ca-environment.helper';
import { CoCommunityHelperService } from '@monorepo/community-lib';

/**
 * Only for local environment, add the space domain to the request
 */
@Injectable()
export class CaSpaceInterceptor implements HttpInterceptor {
  private readonly spaceHeader = 'local-space';

  constructor(
    private currentSpaceService: CaCurrentSpaceService,
    private coCommunityHelper: CoCommunityHelperService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If request is for community API, do not add space header
    if (req.url.includes(this.coCommunityHelper.getCommunityApiUrl())) {
      return next.handle(req);
    }

    if (!CaEnvironmentHelper.isProduction() && this.currentSpaceService.getCurrentSpaceDomainDev() != null) {
      req = req.clone({
        headers: req.headers.set(this.spaceHeader, this.currentSpaceService.getCurrentSpaceDomainDev()),
      });
    }
    return next.handle(req);
  }
}
