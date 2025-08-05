import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { DcAuthenticationInfo } from '../../../core/model/dc-dynamic-component.class';

/**
 * Interceptor to add the lang to the headers
 * This interceptor must be provided to if the component calls lab api
 * There is only 1 instance of the interceptor in the app (for multiple streamlit components)
 * This should not be a problem because all components uses the same credentials
 * But this is not perfect.
 * We should create a FlApiService for each component (not at root level) but it creates problems in lab-lib
 * (like dialog service)
 */
@Injectable()
export class DcHttpInterceptorService implements HttpInterceptor {
  private translateService = inject(FlTranslateService);

  private authInfo: DcAuthenticationInfo;

  public init(userAuthInfo: DcAuthenticationInfo): void {
    if (this.authInfo == null) {
      this.authInfo = userAuthInfo;
    } else {
      if (
        this.authInfo.app_id !== userAuthInfo.app_id ||
        this.authInfo.user_access_token !== userAuthInfo.user_access_token
      ) {
        // this should not happen
        throw new Error(
          'DcHttpInterceptorService was already initialized with a different authentication info'
        );
      }
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // skip interceptor if the request is not to the lab api
    // like call to assets
    if (!req.url.startsWith('http')) {
      return next.handle(req);
    }
    // add lang to the headers
    const lang: string = this.translateService.getUserLanguage();

    let headers = req.headers ? req.headers : new HttpHeaders();
    headers = headers.append('lang', lang);

    if (this.authInfo != null) {
      headers = headers.append('gws_user_access_token', this.authInfo.user_access_token);
      headers = headers.append('gws_app_id', this.authInfo.app_id);
    }

    req = req.clone({
      withCredentials: true,
      headers: headers,
    });
    return next.handle(req);
  }
}
