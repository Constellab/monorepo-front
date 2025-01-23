import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { Request } from 'express';
import { REQUEST } from '@monorepo/front-core-lib/fl-theme';

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
    if (isPlatformServer(this.platformId) && this.request?.cookies['Authorization'] != null) {
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
