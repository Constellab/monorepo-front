import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { DcMainState } from './dc-main.state';

/**
 * Interceptor to add the lang to the headers
 * This interceptor must be provided to if the component calls lab api
 */
@Injectable()
export class DcHttpInterceptorService implements HttpInterceptor {
  private translateService = inject(FlTranslateService);
  private mainState = inject(DcMainState);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add lang to the headers
    const lang: string = this.translateService.getUserLanguage();

    let headers = req.headers ? req.headers : new HttpHeaders();
    headers = headers.append('lang', lang);

    const authInfo = this.mainState.getUserAuthenticationInfo();
    headers = headers.append('gws_user_access_token', authInfo.user_access_token);
    headers = headers.append('gws_app_id', authInfo.app_id);

    req = req.clone({
      withCredentials: true,
      headers: headers,
    });
    return next.handle(req);
  }
}
