import {Inject, Injectable, InjectionToken, Optional, PLATFORM_ID} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {isPlatformServer} from '@angular/common';
import {Request} from 'express';

// Define the `Request` token
export const REQUEST = new InjectionToken<Request>('REQUEST');

@Injectable()
export class HaHttpInterceptorSsrService implements HttpInterceptor {

  private request: Request;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              @Optional() @Inject(REQUEST) request: Request) {
    if (isPlatformServer(this.platformId)) {
      this.request = request;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add lang to the headers
    if (isPlatformServer(this.platformId) && this.request.cookies['Authorization'] != null) {
      req = req.clone({
        withCredentials: true,
        headers: req.headers ? req.headers.append('authorization', this.request.cookies['Authorization']) :
          new HttpHeaders({
            authorization: this.request.cookies['Authorization'],
          })
      });
    }
    return next.handle(req);
  }
}
