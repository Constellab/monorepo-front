import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { LiShareLinkPublicAuth } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LabHttpInterceptorService implements HttpInterceptor {
  private translateService = inject(FlTranslateService);
  private apiService = inject(FlApiService);

  /**
   * The authentication info for public link access
   * It is set when the component for public link is initialized
   * and cleared when the component is destroyed
   * This way, the interceptor will add the authentication info to the requests only when needed
   */
  private linkPublicAuth: LiShareLinkPublicAuth | null = null;

  constructor() {
    console.log('LabPublicInterceptorService initialized');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add lang to the headers

    let headers = req.headers.append('lang', this.translateService.getUserLanguage());

    if (this.linkPublicAuth && this.apiService.isApiUrl(req.url)) {
      headers = headers.append('gws_user_access_token', this.linkPublicAuth.userAccessToken ?? '');
      headers = headers.append('Authorization', `ShareToken ${this.linkPublicAuth.token}`);
    }

    req = req.clone({
      withCredentials: true,
      headers: headers,
    });
    return next.handle(req);
  }

  public setLinkPublicAuth(auth: LiShareLinkPublicAuth): void {
    this.linkPublicAuth = auth;
  }

  public clearLinkPublicAuth(): void {
    this.linkPublicAuth = null;
  }
}
