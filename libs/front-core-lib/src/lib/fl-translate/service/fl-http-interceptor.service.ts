import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlTranslateService } from './fl-translate.service';

@Injectable()
export class FlHttpInterceptorService implements HttpInterceptor {
  private translateService = inject(FlTranslateService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add lang to the headers

    const lang: string = this.translateService.getUserLanguage();

    req = req.clone({
      withCredentials: true,
      headers: req.headers
        ? req.headers.append('lang', lang)
        : new HttpHeaders({
            lang: lang,
          }),
    });
    return next.handle(req);
  }
}
