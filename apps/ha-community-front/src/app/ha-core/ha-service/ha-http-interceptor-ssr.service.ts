import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

/**
 * SSR-only HTTP interceptor.
 *
 * During server-side rendering, the browser's cookies aren't available to HttpClient.
 * This interceptor reads the Authorization cookie from the Express request object
 * and forwards it as an HTTP header on all outgoing API calls, so the backend
 * can authenticate the user during SSR.
 *
 * On the browser this interceptor is a no-op (isPlatformServer is false).
 */
@Injectable()
export class HaHttpInterceptorSsrService implements HttpInterceptor {
  private platformId = inject(PLATFORM_ID);

  private request: Request;

  constructor() {
    const request = inject<Request>(REQUEST, { optional: true });

    if (isPlatformServer(this.platformId)) {
      this.request = request;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add lang to the headers
    if (
      isPlatformServer(this.platformId) &&
      this.request?.cookies &&
      this.request?.cookies['Authorization'] != null
    ) {
      req = req.clone({
        withCredentials: true,
        headers: req.headers
          ? req.headers.append('authorization', this.request.cookies['Authorization'])
          : new HttpHeaders({
            authorization: this.request.cookies['Authorization'],
          }),
      });
    }
    return next.handle(req);
  }
}
