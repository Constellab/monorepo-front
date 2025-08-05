import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

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
